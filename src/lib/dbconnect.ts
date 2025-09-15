import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

// The question makes it optional but if it exists it is number


const connection : ConnectionObject = {}

// This tells us thee function will return a Promise<void> means no structure
export const dbConnect = async() : Promise<void>  => {
    // console.log(connection.isConnected);
    
    if(connection.isConnected){
        console.log("The data base is connected");
        return
    }
    try {
        const connectionInstance = await mongoose.connect(process.env.MONOGDB_URI || "",{})
        console.log(`\n Mongo Db Connected: \n Db Host: ${connectionInstance.connection.host}`);
        
        connection.isConnected = connectionInstance.connections[0].readyState
    } catch (error) {
        console.log("Error in connecting to db",{error})
        process.exit(1)
    }
}