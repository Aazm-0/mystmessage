import bycrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/helpers/sendVerificationCode';
import { dbConnect } from "@/lib/dbconnect";
import User from '@/models/User.model';
import crypto from "crypto"

// Next js runs on edge so db COnnect on every route  thats why checking needed

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {userName,email,password} = await request.json()

        const userIdentifiedByEmailUsername = await User.findOne({
            userName,
            email
        })
        const otpVerificationCode = crypto.randomInt(100000, 999999).toString()

        if(!userIdentifiedByEmailUsername){
            // New user
            const hashedPassword = await bycrypt.hash(password,10)
            const otpExpiry = new Date(Date.now() + 60 * 60 * 1000)
            const newUser = new User({
                userName,
                email,
                password: hashedPassword,
                verifyCode: otpVerificationCode,
                verifyCodeExpiry: otpExpiry,
                messages: []
            })
            await newUser.save()
        }else{
            if(userIdentifiedByEmailUsername.isVerifierd){
                // Already Existing + Verified user
                return Response.json({
                    success: false,
                    message: "User already exists"
                },{status :  400});                  
            }else{
                // Existing User not verified
                // Updated User Info
                const hashedPassword = await bycrypt.hash(password,10)
                const otpExpiry = new Date(Date.now() + 60 * 60 * 1000)
                userIdentifiedByEmailUsername.password = hashedPassword
                userIdentifiedByEmailUsername.verifyCode = otpVerificationCode
                userIdentifiedByEmailUsername.verifyCodeExpiry = otpExpiry
                await userIdentifiedByEmailUsername.save()
            }
        }

        // Sending Email
        const verifyEmail = await sendVerificationEmail(email,userName,otpVerificationCode)
        console.log(verifyEmail);
        
        if(!verifyEmail.success){
            return Response.json({
                success: false,
                message: "Error sending the email verification"
            },{status :  500})
        }

        return Response.json(
            {   
                
                success: true,
                message: "User created successfully",
            },{status: 201}
        )

    } catch (error) {
        console.log("Error registering user",error);
        return Response.json(
            {
                success: false,
                message: `Error registering user ${error}`
            },
            {
                status: 500
            }
        )
    }
}