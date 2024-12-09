import { UserDto } from "../user";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  access_token_max_age: number;
  refresh_token_max_age: number;
  user: UserDto;
}

export type AvatarUser = {
  avatar: File;
};