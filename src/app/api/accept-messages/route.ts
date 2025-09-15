import { User, getServerSession } from "next-auth";
import { authConfig } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";
import { dbConnect } from "@/lib/dbconnect";

// getServerSession only owrks on serveer side components
// For toggling accepting messages or stopping accepting messages
export async function POST(request:Request){
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
    const userId = user._id

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                message : "Failed to  update User",
                success: false
            },{
                status: 401
            })
        }

        return Response.json({
            message : "Updated Accept Message Flag successfully",
            success: true,
            updatedUser
        },{
            status: 200
        })
    } catch (error) {
        console.log("Failed to change accepting meessages flag");
        console.log(error);
        return Response.json({
            message : "Failed to change accepting meessages flag",
            success: false
        },{
            status: 500
        })
    }

}


// For getting the status
export async function GET(request:Request){
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
    const userId = user._id

// Remember the try catch should only be surronded in places where the db errors you cant guess could occur
    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser){
            return Response.json({
                message : "No User found",
                success: false
            },{
                status: 400
            })
        }

        return Response.json({
            message : "User successfuly found with message flag",
            success: true,
            isAcceptingMessages : foundUser.isAcceptingMessages
        },{
            status: 200
        })
    } catch (error) {
        console.log("failed to get user accept messages flag from database");
        console.log(error);
        return Response.json({
            message : "failed to get user accept messages flag from database",
            success: false
        },{
            status: 500
        }) 
    }
}