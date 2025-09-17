"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/schema/signUpSchema";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"

function page() {
    // We need to debounce this late so we can properly use it
    const [userName, setUsername] = useState("")
    // This stores the state for the response which we will get from the api for the username being available or not
    const [userNameMessage, setUserNameMessage] = useState("")
    // Look the fields are being defined as you go down the workflow
    const [isUserNameLoading, setIsUserNameLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    // debouncing using hook
    const debounced = useDebounceCallback(setUsername, 500)
    const router = useRouter()

    // zod implementation link with form 
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: ""
        }
    })

    // For get request of username being unique or not
    useEffect(() => {
        const checkUserNameUnique = async () => {
            // Check if empty so in initial load when it is empty or anytime you dont call
            if (userName) {
                setIsUserNameLoading(true)
                setUserNameMessage("")
                // Empty out the errors
                try {
                    const response = await axios.get(`api/check-username-unique?username=${userName}`)
                    setUserNameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUserNameMessage(axiosError.response?.data.message ?? "Error checking Usernam")
                } finally {
                    setIsUserNameLoading(false)
                }
            }
        }

        checkUserNameUnique()
    }, [userName])

    const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data)
            toast("Success", {
                description: response.data.message
            })
            router.replace(`/verify/${userName}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Failure", {
                description: axiosError.response?.data.message ?? "Error in posting username"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isUserNameLoading 
                                    && <Loader2 className="animate-spin"/>}
                                    <p className={`text-sm ${userNameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                                        test {userNameMessage} 
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please Wait
                                </>
                            ) : ('SignUp')}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default page;