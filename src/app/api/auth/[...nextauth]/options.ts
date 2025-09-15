import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from "@/lib/dbconnect"
import UserModel from "@/models/User.model"
import bcrypt from "bcryptjs"

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {userName: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }
                    if(!user.isVerifierd){
                        throw new Error("User is not verified")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    if(!isPasswordCorrect){
                        throw new Error("The password is not correct")
                    }
                    // See when you return the user the control goes back to the authOptions
                    return user
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.userName = user.userName
            }
            // The user here is the one you returned above in the authorize funciton
            // The reason we do this is so when we are sending the token and the session we can attach data to it
            // thus we wont have to query the db
            return token
        },
        async session({token,session}){
            if(token){
                if (session.user) {
                    session.user._id = token._id
                    session.user.isAcceptingMessages = token.isAcceptingMessages
                    session.user.isVerified = token.isVerified
                    session.user.userName = token.userName
                }
            }
            return session
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}