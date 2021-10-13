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

export interface LegacyThread {
  name: string;
  connections: UserConnection[];
  messages: Message[];
}

export interface Thread {
  id: string;
  name: string;
  createdAt: number;
  owner: User;
}
