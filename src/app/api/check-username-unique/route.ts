import User from "@/models/User.model";
import { dbConnect } from "@/lib/dbconnect";
import { userNameValidation } from "@/schema/signUpSchema";
import z, { success } from "zod";

// First of all you validate the input using zod UsernameQuerySchema

const UserNameQuerySchema = z.object({
    username : userNameValidation
})

// Oh here we are basically using thee old schema to create a new schema to use here then we can use it to safe parse

export async function GET(request: Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        // The url object has a property called search params as an object 
        const queryParam = {
            username: searchParams.get("username")
        }
        // params is an instance of URLSearchParams, which acts like a map of key → value pairs.
        // match the shape of the checked object with the schema
        const usernameParsed = UserNameQuerySchema.safeParse(queryParam)
        if(!usernameParsed.success){
            let formattedUsernameErrors: string[] = []
            const formatted =  z.treeifyError(usernameParsed.error)
            formattedUsernameErrors = formatted.properties?.username?.errors || []
            return Response.json({
                success: false,
                message: formattedUsernameErrors?.length > 0 ? formattedUsernameErrors.join(', ') : "Invalid query Parameter"
        },{status : 400})
        }
        
        const {username : userName} = usernameParsed.data
        
        const existingVerifiedUser = await User.findOne({userName , isVerifierd: true}) 

    
        
        if(existingVerifiedUser){z
            return Response.json({
                success: false,
                message: "Username is not unique",
            },{
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: "Username is unique"
        },{
            status : 200
        }
        )

    } catch (error) {
        console.log("Error checking username is unique");
        return Response.json({
            success: false,
            message: "Error checking username is unique",
        },{
            status: 500
        })
        
    }
}