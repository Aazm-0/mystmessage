import { dbConnect } from "@/lib/dbconnect"
import { getServerSession, User } from "next-auth"
import { authConfig } from "../../auth/[...nextauth]/options"
import UserModel from "@/models/User.model"

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = await params.messageid
    await dbConnect()
    const session = await getServerSession(authConfig)
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )
        if (updateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message already delted or not found"
            }, { status: 404 })
        }

         return Response.json({
            success : true,
            message: "Message Deleted"
        },{status : 200})
    } catch (error) {
         return Response.json({
            success : false,
            message: "Error deleting message"
        },{status : 500})
    }
}