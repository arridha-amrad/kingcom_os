export interface SignupRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  identity: string;
  password: string;
}

export interface VerifyRequest {
  code: string;
  token: string;
}
