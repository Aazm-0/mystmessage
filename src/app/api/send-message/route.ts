
import UserModel from "@/models/User.model";
import { dbConnect } from "@/lib/dbconnect";
import { Message } from "@/models/User.model";

export async function POST(request: Request) {
    await dbConnect()
    const { userName, content } = await request.json()

    try {
        const user = await UserModel.findOne({ userName })

        if (!user) {
            return Response.json({
                message: "No User found",
                success: false
            }, {
                status: 401
            })
        }

        // Remeber you need to send error if user is not acceptin messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                message: "User is not accepting messages",
                success: false
            }, {
                status: 403
            })
        }

        const userMessage = { content, createdAt: new Date() }
        // Remeber you built interface for the type for message so when you are pushing it keep the type assertion
        user.messages.push(userMessage as Message)
        await user.save()

        return Response.json({
            message : "Message sent to user",
            success: true
        },{
            status: 200
        })

    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Failed to send message to user",
            success: false
        }, {
            status: 500
        })
    }
}