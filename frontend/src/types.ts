export interface User {
  id: string;
  username: string;
  createdAt: number;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  createdAt: number;
}

export interface UserConnection {
  userId: string;
  connectionId: string;
}

export type RichUserConnection = User & Partial<UserConnection>;

export interface Thread {
  name: string;
  connections: UserConnection[];
  messages: Message[];
}

export interface APIThread {
  id: string;
  name: string;
  createdAt: number;
  owner: User;
}
