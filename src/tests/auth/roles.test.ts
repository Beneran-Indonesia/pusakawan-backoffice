/*
TEST: roles function:
1. If user is logged in, and role is: super admin. User should be able to get in all routes,
and menubar should have all (app/lms)
2. If role is: admin. User should be able to have all the super admin capabilities except manage users.
3. If role is: LMS. User should only be able to access the /lms/programs route.
4. If role is: APP. User should only be able to access the /app/games route.
Lastly: should check that the first route redirect is index [0] of resources.
*/
