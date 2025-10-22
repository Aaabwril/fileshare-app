export interface FileRecord {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  storage_url: string;
  storage_key: string;
  share_token: string | null;
  is_public: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  bio: string | null;
  birthday: string | null;
  created_at: string;
  updated_at: string;
}
