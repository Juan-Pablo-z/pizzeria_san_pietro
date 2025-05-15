import { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  ced_user: string;
  nom_user: string;
  email_user: string;
  password_user: string;
  fkcod_car_user: number;
  dcar: string;
}

declare module "next-auth" {
  interface Session {
    user: IUser;
    // accessToken: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
