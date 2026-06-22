import { http, HttpResponse } from 'msw'
import { UserToken } from '@/types/users'
import { LOGIN_API_URL, LOGOUT_API_URL, REFRESH_TOKEN_API_URL } from '@/lib/urls'
import { getCookieValue } from '@/lib/utils';

const mockUser: UserToken["user"] = {
    id: 1,
    email: "a@g.c",
    name: "Sarah",
    role: "ADMIN",
    isVerified: true,
};

const REFRESH_TOKEN = "YU4KmQ3rVzW3LjFaSU6hMrJimy9sQGKj";
const ACCESS_TOKEN = "uilutMYIHcDkocGj9pTr0eCsLJACt3MT";

const mockToken = (role: UserToken["user"]["role"]): UserToken => ({
    accessToken: ACCESS_TOKEN,
    expires_in: 900,
    user: { ...mockUser, role },
    profileCompleted: true,
});

// REFRESH
const refreshHandler = http.post(REFRESH_TOKEN_API_URL, async ({ request }) => {
    // Get the refresh token in the cookie 
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
        return HttpResponse.json(
            { message: "No refresh token" },
            { status: 401 },
        );
    }

    const refreshToken = getCookieValue(cookieHeader, "refresh_token");

    if (!refreshToken) {
        return HttpResponse.json(
            { message: "No refresh token" },
            { status: 401 },
        );
    }
    // if refresh token is valid, return user.
    if (refreshToken !== REFRESH_TOKEN) {
        return HttpResponse.json(
            { message: "Invalid refresh token" },
            { status: 401 },
        );
    }

    const role = (getCookieValue(cookieHeader, "role") ?? "APP") as UserToken["user"]["role"]; 

    return new HttpResponse(
        JSON.stringify(mockToken(role)),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `refresh_token=${REFRESH_TOKEN}; Path=/; HttpOnly`,
            },
        },
    );

})

// LOGOUT
const logoutHandler = http.post(LOGOUT_API_URL, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    return HttpResponse.json(
        { message: "Logout successful" },
        { status: 200 }
    );
});

// LOGIN
const loginHandler = http.post(LOGIN_API_URL, async ({ request }) => {
    const body = await request.json() as {
        email: string;
        password: string;
        rememberMe?: boolean;
    };

    const { email, password, rememberMe } = body;

    if (!email || !password) {
        return HttpResponse.json(
            { message: "Missing fields" },
            { status: 400 }
        );
    }

    const users: Record<string, UserToken["user"]["role"]> = {
        "superadmin@test.com": "SUPER_ADMIN",
        "admin@test.com": "ADMIN",
        "lms@test.com": "LMS",
    };

    let role: UserToken["user"]["role"] = "APP";

    if (password === "password" && email in users) {
        role = users[email];
    }

    const response = mockToken(role);

    const headers: Record<string, string> = {};

    // simulate refresh token cookie ONLY when rememberMe is true
    if (rememberMe) {
        headers["Set-Cookie"] =
            `role=${role}; refresh_token=${REFRESH_TOKEN}; Path=/; HttpOnly;`;
    }

    return HttpResponse.json({ data: response }, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
})

export const authHandlers = [
    loginHandler,
    logoutHandler,
    refreshHandler
];