export interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}
