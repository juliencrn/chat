export interface Model {
  id: string;
  createdAt: number;
}

export interface User extends Model {
  username: string;
}

export interface Thread extends Model {
  slug: string;
  name: string;
  owner: User;
}

export interface ThreadState extends Thread {
  messages: Message[];
  lastAddingMethod:
    | "new_message"
    | "api_refetch"
    | "idle"
    | "initial_fetch"
    | "last_fetch";
}

export interface Message extends Model {
  user: User;
  text: string;
  thread: Thread;
}

export interface UserConnection {
  userId: string;
  connectionId: string;
}

export type RichUserConnection = User & Partial<UserConnection>;

export interface AccessToken {
  accessToken: string;
}

export interface ServerError {
  statusCode: number;
  message: string;
  error: string;
}

export type ThemeVariant = "primary" | "secondary" | "danger";
