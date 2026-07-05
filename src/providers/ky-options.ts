/* eslint-disable @typescript-eslint/no-explicit-any */
import { authStore } from "./auth-provider";

export const kyOptions = {
  
  hooks: {
    beforeError: [
      async (error: any) => {
        if (error.cause === "AuthenticationError") {
          window.location.assign("/");
        }

        console.log("BEFORE ERROR:", error.message);

        throw new Error(error.message ?? "Error occurred in server");
      },
    ],

    beforeRequest: [
      async (request: any) => {
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
