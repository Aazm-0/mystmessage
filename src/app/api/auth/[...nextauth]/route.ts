import NextAuth from "next-auth";
import { authConfig } from "./options";

const handler = NextAuth(authConfig)

export {handler as GET, handler as POST}

// Oh in the route folder you have verbs for route handling or http methods verb names so you have to export them as similar names
// as nextauth is a framework it makes you follow rules