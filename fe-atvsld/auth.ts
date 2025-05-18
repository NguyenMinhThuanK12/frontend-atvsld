// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   // providers: [
//   //   Credentials({
//   //     name: "Credentials",
//   //     credentials: {
//   //       username: { label: "Username", type: "text" },
//   //       password: { label: "Password", type: "password" },
//   //       departmentId: { label: "Department ID", type: "number" },
//   //     },
//   //     async authorize(credentials) {
//   //       const res = await fetch("http://localhost:8080/api/v1/authenticate", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({
//   //           username: credentials?.username,
//   //           password: credentials?.password,
//   //           departmentId: parseInt(credentials?.departmentId as string || "0"),
//   //         }),
//   //       });

//   //       const data = await res.json();

//   //       if (data.code === 200 && data.result.authenticated) {
//   //         return {
//   //           name: typeof credentials?.username === "string" ? credentials.username : "",
//   //           email: typeof credentials?.username === "string" ? `${credentials.username}@example.com` : "",
//   //           departmentId: typeof credentials?.departmentId === "string" ? credentials.departmentId : "",
//   //         };
//   //       }
//   //       return null;
//   //     },
//   //   }),
//   // ],
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         departmentId: { label: "Department ID", type: "number" },
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         if (
//           !credentials?.departmentId ||
//           !credentials?.username ||
//           !credentials?.password
//         ) {
//           return null; // Return null if credentials are incomplete
//         }

//         // create a user
//         const user = {
//           id: "1", // Required: `id` is mandatory for the `User` type
//           departmentId: Number(credentials.departmentId), // Convert to number
//           username: credentials.username as string,
//           password: credentials.password as string, // Optional: map to `name`
//         };
//         console.log("User:", user);
        

//         if (!user) {
//           // No user found, so this is their first attempt to login
//           // Optionally, this is also the place you could do a user registration
//           throw new Error("Invalid credentials.");
//         }

//         // return user object with their profile data
//         return user;
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/auth/login",
//   },
// });
