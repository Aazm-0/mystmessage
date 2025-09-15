import User from "@/models/User.model";
import { dbConnect } from "@/lib/dbconnect";

// Remember get methods should not take in a body only url search queries
export async function POST(request: Request) {
    await dbConnect()

    try {
        const { userName, code } = await request.json()

        const user = await User.findOne({userName})

        if (!user) {
            return Response.json({
                success: false,
                message: "User doesnt exist",
            }, {
                status: 400
            })
        }

        const isVerifyCodeCorrect = user.verifyCode === code
        const isVerifyCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isVerifyCodeCorrect && isVerifyCodeNotExpired){
            user.isVerifierd = true
            await user.save()
            return Response.json({
                success: true,
                message: "Accoount Verified",
            }, {
                status: 200
            })
        } else if(!isVerifyCodeCorrect){
            return Response.json({
                success: false,
                message: "Verify Code is incorrect",
            }, {
                status: 400
            })
        } else{
            return Response.json({
                success: false,
                message: "Verify Code is expired please sign up again ",
            }, {
                status: 400
            })
            
        }
 
    } catch (error) {
        console.log("Error checking veridy code",error);
        return Response.json({
            success: false,
            message: "Error checking veridy code",
        }, {
            status: 500
        })

    }
}