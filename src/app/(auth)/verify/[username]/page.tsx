"use client"
import z from "zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schema/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function page() {
    const params = useParams<{ username: string }>()
    const router = useRouter()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>("/api/verify-code", {
                userName: params.username,
                code: data.code
            })
            toast("Success", {
                description: response.data.message
            })
            router.replace("/sign-in")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            
            
            toast("Failure", {
                description: axiosError.response?.data.message ?? "Error in getting code"
            })
        }
    }


    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default page;