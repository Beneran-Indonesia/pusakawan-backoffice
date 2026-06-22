type User = {
    id: number;
    email: string;
    name: string;
    role: "ADMIN" | "SUPER_ADMIN" | "LMS" | "APP";
    avatar?: string;
    isVerified: boolean;
};

export type UserToken = {
    accessToken: string;
    expires_in: number;
    user: User;
    profileCompleted: boolean;
};