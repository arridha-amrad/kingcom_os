export interface SignupResponse {
   token: string;
   message: string;
}

export interface User {
   id: string;
   created_at: Date;
   updated_at: Date;
   deleted_at: Date;
   username: string;
   name: string;
   email: string;
   provider: string;
   role: string;
   is_verified: boolean;
}

export interface LoginResponse {
   user: User;
   token: string;
}

export interface VerifyResponse {
   user: User;
   token: string;
}

export interface MeResponse {
   user: User;
}
