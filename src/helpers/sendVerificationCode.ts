import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schema/messageSchema";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });


        if(error) {
            throw new Error(error.message || JSON.stringify(error)) 
        }
        
        return { success: true, message: "Email sent successfully" }

    } catch (emailError) {
        console.log(`Error sending verification email`, emailError);
        return { success: false, message: `Failed to send verification email ${emailError instanceof Error ? emailError.message : String(emailError)}` }
    }
}