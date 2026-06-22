import * as React from "react";

export type UserToken = {
  accessToken: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "SUPER_ADMIN" | "LMS" | "APP";
    avatar?: string;
    isVerified: boolean;
  };
  profileCompleted: boolean;
};

export const UserContext = React.createContext<null | UserToken>(null);