import React, { useState, useEffect } from 'react';
import { User, Language, VideoData, DownloadHistoryItem, FavoriteItem, Announcement } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { LoginModal } from './components/LoginModal';
import { BannedScreen } from './components/BannedScreen';
import { VideoDownloader } from './components/VideoDownloader';
import { AiEnhancer } from './components/AiEnhancer';
import { BatchDownloader } from './components/BatchDownloader';
import { HistoryAndFavorites } from './components/HistoryAndFavorites';
import { AdminDashboard } from './components/AdminDashboard';
import { WelcomeIntro } from './components/WelcomeIntro';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<'downloader' | 'aiEnhancer' | 'batch' | 'history' | 'favorites' | 'admin'>('downloader');
  const [favOrHistoryView, setFavOrHistoryView] = useState<'history' | 'favorites'>('history');
  const [showWelcome, setShowWelcome] = useState(true);

  // User State
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  // App State
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);

  // Sync HTML Dir & Language (RTL / LTR)
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Load Saved User & Check Status
  useEffect(() => {
    const savedUserJson = localStorage.getItem('pipo_user');
    if (savedUserJson) {
      try {
        const savedUser: User = JSON.parse(savedUserJson);
        setUser(savedUser);
        
        // Verify with server
        api.getMe(savedUser.id).then(res => {
          if (res.isBanned) {
            setIsBanned(true);
            if (res.user) setUser(res.user);
          } else if (res.user) {
            setUser(res.user);
            localStorage.setItem('pipo_user', JSON.stringify(res.user));
          }
          if (res.announcement) setAnnouncement(res.announcement);
        });

        // Load History & Favorites
        loadUserData(savedUser.id);
      } catch (e) {
        localStorage.removeItem('pipo_user');
      }
    } else {
      // Open identification prompt on first visit
      const hasVisited = sessionStorage.getItem('pipo_visited');
      if (!hasVisited) {
        setIsLoginOpen(true);
        sessionStorage.setItem('pipo_visited', 'true');
      }
    }

    // Load announcement
    api.getAnnouncement().then(ann => {
      if (ann) setAnnouncement(ann);
    });
  }, []);

  const loadUserData = async (userId: string) => {
    const [hist, favs] = await Promise.all([
      api.getHistory(userId),
      api.getFavorites(userId)
    ]);
    setHistory(hist);
    setFavorites(favs);
  };

  const handleLoginSuccess = (loggedInUser: User, newAnnouncement?: Announcement) => {
    setUser(loggedInUser);
    setIsBanned(loggedInUser.isBanned);
    localStorage.setItem('pipo_user', JSON.stringify(loggedInUser));
    if (newAnnouncement) setAnnouncement(newAnnouncement);
    loadUserData(loggedInUser.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('pipo_user');
    setUser(null);
    setIsBanned(false);
    setHistory([]);
    setFavorites([]);
  };

  // Toggle Favorite Action
  const handleToggleFavorite = async (video: VideoData) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    const isFav = favorites.some(f => f.videoId === video.id);
    if (isFav) {
      await api.removeFavorite(user.id, video.id);
    } else {
      await api.addFavorite({
        userId: user.id,
        videoId: video.id,
        title: video.title,
        authorName: video.author.nickname || video.author.unique_id,
        authorAvatar: video.author.avatar,
        thumbnail: video.cover,
        videoUrl: video.hdplay || video.play,
        audioUrl: video.music || video.music_info?.play_url,
        platform: 'tiktok',
        originalUrl: video.originalUrl
      });
    }
    loadUserData(user.id);
  };

  // Handle tab switch
  const handleTabChange = (tab: 'downloader' | 'aiEnhancer' | 'batch' | 'history' | 'favorites' | 'admin') => {
    if (tab === 'favorites') {
      setFavOrHistoryView('favorites');
      setActiveTab('favorites');
    } else if (tab === 'history') {
      setFavOrHistoryView('history');
      setActiveTab('history');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] cyber-grid-bg text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black">
      
      {/* Background Radial Glow */}
      <div className="fixed inset-0 cyber-radial-glow pointer-events-none -z-10" />

      {/* Top Admin Announcement Banner */}
      <AnnouncementBanner announcement={announcement} />

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        lang={lang}
        setLang={setLang}
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-10">
        
        {/* If user is banned */}
        {isBanned && user ? (
          <BannedScreen user={user} lang={lang} onLogout={handleLogout} />
        ) : (
          <>
            {activeTab === 'downloader' && (
              <VideoDownloader
                user={user}
                lang={lang}
                onOpenLogin={() => setIsLoginOpen(true)}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onVideoExtracted={(v) => setCurrentVideo(v)}
              />
            )}

            {activeTab === 'aiEnhancer' && (
              <AiEnhancer lang={lang} currentVideo={currentVideo} />
            )}

            {activeTab === 'batch' && (
              <BatchDownloader
                user={user}
                lang={lang}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            )}

            {(activeTab === 'history' || activeTab === 'favorites') && (
              <HistoryAndFavorites
                activeView={favOrHistoryView}
                setActiveView={setFavOrHistoryView}
                user={user}
                lang={lang}
                history={history}
                favorites={favorites}
                onRefreshHistory={() => user && loadUserData(user.id)}
                onRefreshFavorites={() => user && loadUserData(user.id)}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard lang={lang} />
            )}
          </>
        )}

      </main>

      {/* Login / Register Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Footer */}
      <Footer lang={lang} />

      {/* Futuristic Cyber Intro with Female AI Voice */}
      {showWelcome && (
        <WelcomeIntro onClose={() => setShowWelcome(false)} />
      )}

    </div>
  );
}
