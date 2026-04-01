export type UserRole = "student" | "teacher" | "parent";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  user: User;
}
