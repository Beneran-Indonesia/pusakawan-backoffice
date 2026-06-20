import * as React from "react";

export type UserToken = {
  accessToken: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    role: "MEMBER" | "ADMIN" | "SUPERADMIN";
    isVerified: boolean;
  };
  profileCompleted: boolean;
};

export const UserContext = React.createContext<null | UserToken>(null);