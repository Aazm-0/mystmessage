import "next-auth"
import { DefaultSession } from "next-auth"
import "next-auth/jwt" 

declare module "next-auth" {
    interface User {
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        userName?: string
    }
    interface Session {
        user: {
            _id?: string,
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            userName?: string
        } & DefaultSession['user']
    }
    // The reason you need DefaultSession is to keep the orignal user values because interface extend but when same name property it overwrites 
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        userName?: string
    }
}