import { authStore } from "./auth";

export const kyOptions = {
  hooks: {
    beforeError: [
      async (error: unknown) => {
        if (error.cause === "AuthenticationError") {
          window.location.assign("/");
        }

        console.log("BEFORE ERROR:", error.message);

        throw new Error(error.message ?? "Error occurred in server");
      },
    ],

    beforeRequest: [
      async (request: unknown) => {
        const user = authStore.getUser();

        if (user) {
          // Custom: Add Bearer token
          request.headers.set("Authorization", `Bearer ${user.accessToken}`);
        } else {
          // Custom: Redirect to login if no token
          window.location.href = "/";
          throw new Error("No authentication token found");
        }
      }
    ]
  },
} // KY Options

// export const beforeError: BeforeErrorHook[] = [
//     async (error) => {
//         if (error.cause === "AuthenticationError") {
//             window.location.assign("/");
//         }

//         console.log("BEFORE ERROR:", error.message);

//         throw new Error(error.message ?? "Error occurred in server");
//     },
// ];

// export const beforeRequest: BeforeRequestHook[] = [
//     async ({ request }) => {
//         const user = authStore.getUser();

//         if (user) {
//             // Custom: Add Bearer token
//             request.headers.set("Authorization", `Bearer ${user.accessToken}`);
//         } else {
//             // Custom: Redirect to login if no token
//             window.location.href = "/";
//             throw new Error("No authentication token found");
//         }
//     }
// ]