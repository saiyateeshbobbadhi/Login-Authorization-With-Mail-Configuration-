import { User } from "src/users/user.entity";
export interface EmailVerification{
    email: string;
    emailToken?: string;
  }