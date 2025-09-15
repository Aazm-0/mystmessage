import {z} from "zod";

export const userNameValidation = z
.string()
.min(4,"Username must be atleast 2 characters")
.max(20,"Username must be lower than 20 characters")
.regex(/^[a-zA-Z0-9]+$/,"Username must not contain special charcters")

export const SignUpSchema = z.object({
    // It automatically checks if it is empty or not you can also chain the methods
    userName:  userNameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "password must be atleast six chars"})    
})