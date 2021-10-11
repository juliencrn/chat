export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  createdAt: number;
}
