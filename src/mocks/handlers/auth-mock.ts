import { http, HttpResponse } from 'msw'
import { UserToken } from '@/types/users-type'
import { LOGIN_API_URL, LOGOUT_API_URL, REFRESH_TOKEN_API_URL } from '@/lib/urls'
// import { getCookieValue } from '@/lib/utils';

const MOCK_USER: UserToken["user"] = {
    id: 1,
    email: "a@g.c",
    name: "Sarah",
    role: "APP",
    isVerified: true,
};

const REFRESH_TOKEN = "YU4KmQ3rVzW3LjFaSU6hMrJimy9sQGKj+04";
const ACCESS_TOKEN = "uilutMYIHcDkocGj9pTr0eCsLJACt3MT";

const mockToken = (role: UserToken["user"]["role"]): UserToken => ({
    accessToken: ACCESS_TOKEN,
    expires_in: 86400,
    user: { ...MOCK_USER, role },
    profileCompleted: true,
});

// REFRESH
const refreshHandler = http.post(REFRESH_TOKEN_API_URL, async ({ cookies }) => {

    // Get the refresh token in the cookie 
    if (!cookies) {
        return HttpResponse.json(
            { message: "No cookies" },
            { status: 401 },
        );
    }

    const refreshToken = cookies["refresh_token"];

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

    // in msw I have to put the role in the cookie to return the mockUser.
    const role = ((cookies["role"]) ?? "APP") as UserToken["user"]["role"];

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

    const headers = new Headers();

    headers.append(
        "Set-Cookie",
        "refresh_token=; Max-Age=0; Path=/; HttpOnly"
    );

    headers.append(
        "Set-Cookie",
        "role=; Max-Age=0; Path=/; HttpOnly"
    );

    return HttpResponse.json(
        { message: "Logout successful" },
        {
            status: 200, headers
        },
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
    const headers = new Headers();

    // simulate refresh token cookie ONLY when rememberMe is true
    if (rememberMe) {
        headers.append(
            "Set-Cookie",
            `refresh_token=${REFRESH_TOKEN}; Max-Age=86400 Path=/; HttpOnly`
        );
    }

    headers.append(
        "Set-Cookie",
        `role=${role}; Path=/ Max-Age=86400 Path=/; HttpOnly`
    );

    return HttpResponse.json({ data: response }, {
        status: 200,
        headers
    });
})

export const authHandlers = [
    loginHandler,
    logoutHandler,
    refreshHandler
];