import { User, getServerSession } from "next-auth";
import { authConfig } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { dbConnect } from "@/lib/dbconnect";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authConfig)

    if(!session?.user || !session){
        return Response.json({
            message : "No authenticated User",
            success: false
        },{
            status: 401
        })
    }

    const user : User = session.user as User
    // Remember the user id you are storing is in String format but in mongoose it is an object id 
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const foundUser = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'$messages.createdAt': -1 }},
            {$group: {_id: "$id", messages: {$push : "$messages"}}}
        ])

        // Remeber aggregation gives off an array
        if(!foundUser || foundUser.length < 0){
            return Response.json({
                message : "No User found",
                success: false
            },{
                status: 401
            })
        }

        return Response.json({
            success: true,
            messages: foundUser[0].messages 
        },{
            status: 200
        })
    } catch (error) {
        console.log(error);
        return Response.json({
            message : "Error getting all the messages for a user",
            success: false
        },{
            status: 500
        })
    }
}