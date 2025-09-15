// Type guidelines for type

import { Message } from "@/models/User.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    // Checking if user wants to send messages
    isAcceptingMessages? : boolean;
    // Like getiing multiple messages from the db 
    messages?: Array<Message>
}


// This gives type safety and suggestions