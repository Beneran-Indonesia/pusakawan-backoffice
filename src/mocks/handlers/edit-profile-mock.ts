import { EDIT_PROFILE_API_URL } from "@/lib/urls";
import { User } from "@/types/users-type";
import { http, HttpResponse } from "msw";

const MOCK_USER: User = {
    id: 1,
    email: "sarah@beneranindonesia.id",
    name: "Sarah",
    role: "APP",
    avatar: "https://avatars.githubusercontent.com/u/84066712?v=4",
    gender: "FEMALE",
    birthdate: "2000-01-01",
    institution: "My Institution",
    phone: "+62123456789",
    isVerified: true,
};

// Create an in-memory "database" state that can be mutated
let activeUser = { ...MOCK_USER };

export const editProfileHandlers = [
    // -------------------------
    // GET ONE
    // -------------------------
    http.get(EDIT_PROFILE_API_URL, () => {
        return HttpResponse.json({ data: activeUser });
    }),

    // -------------------------
    // UPDATE
    // -------------------------
    http.put(EDIT_PROFILE_API_URL, async ({ request }) => {
        try {
            const updates = (await request.json()) as Partial<User>;

            // Update our in-memory user with the incoming payload
            activeUser = {
                ...activeUser,
                ...updates,
                // Ensure read-only/sensitive fields aren't accidentally overwritten
                id: activeUser.id,
                email: activeUser.email,
                role: activeUser.role,
            };

            return HttpResponse.json({ data: activeUser });
        } catch {
            return new HttpResponse("Invalid request body", { status: 400 });
        }
    }),
];