export type Language = 'ar' | 'en';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  ip: string;
  userAgent: string;
  browser: string;
  device: string;
  createdAt: string;
  lastLoginAt: string;
  isBanned: boolean;
  banReason?: string;
  isVIP: boolean;
  downloadsCount: number;
}

export interface VideoAuthor {
  id?: string;
  unique_id: string;
  nickname: string;
  avatar: string;
}

export interface VideoMusic {
  id?: string;
  title: string;
  author: string;
  play_url: string;
  cover?: string;
  duration?: number;
}

export interface VideoData {
  id: string;
  title: string;
  cover: string;
  origin_cover?: string;
  duration: number;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  download_count?: number;
  author: VideoAuthor;
  music_info?: VideoMusic;
  play: string;
  hdplay?: string;
  wmplay?: string;
  music?: string;
  images?: string[];
  platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'pinterest';
  originalUrl: string;
  size?: number;
}

export interface DownloadHistoryItem {
  id: string;
  userId?: string;
  videoId: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  thumbnail: string;
  platform: string;
  format: 'hd' | 'sd' | 'audio' | 'photos';
  downloadUrl: string;
  timestamp: string;
  originalUrl: string;
}

export interface FavoriteItem {
  id: string;
  userId?: string;
  videoId: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  thumbnail: string;
  videoUrl: string;
  audioUrl?: string;
  platform: string;
  addedAt: string;
  originalUrl: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDownloads: number;
  activeUsers: number;
  bannedUsers: number;
  vipUsers: number;
  totalFavorites: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  userName?: string;
  ip?: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
