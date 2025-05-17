import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

interface CustomUser {
  id: string;
  name: string;
  token: string;
  agency: string;
}

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [],
})