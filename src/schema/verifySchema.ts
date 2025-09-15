import { z } from "zod";

export const verifySchema = z.object({
    code : z.string().length(6,"verify code must be 6 digits")
})

// This type of error message is good when individual validation
// if alot of chaining and custoim message use the object