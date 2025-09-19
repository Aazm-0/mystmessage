import { z } from "zod";

export const messageSchema = z.object({
    content: z.string()
    .min(10,{message: "Content must be atleast 10 chars"})
    .max(150,{message: "Content must be smaller than 150 chars"})
})