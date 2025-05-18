// // next-auth.d.ts
// import { User as DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface User extends DefaultUser {
//     departmentId?: number; // Add custom field
//     username?: string; // Add custom field
//   }

//   interface Session {
//     user: {
//       id: string;
//       departmentId?: number;
//       username?: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }
