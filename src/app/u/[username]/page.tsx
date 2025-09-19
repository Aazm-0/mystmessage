"use client"
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useCompletion } from "@ai-sdk/react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schema/messageSchema";
import z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function page() {
    const params = useParams<{ username: string }>()
    const [isLoading, setIsLoading] = useState(false)
    const userName = params.username
    const { completion, error, complete, isLoading: isSuggestLoading } = useCompletion(
        { 
            api: "/api/suggest-message",

        }
    )


    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post<ApiResponse>("/api/send-message", {
                userName,
                content: data.content
            })
            toast("Success", {
                description: response.data.message
            }
            )
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Axios Error", {
                description: axiosError.response?.data.message || "Failed to Fetch Message Statuses"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSuggestedMessages = async () => {
        await complete("")
    }

    const parseStringMessages = (outputMessage: string) => {
        console.log(outputMessage);

        return outputMessage.split('||')
            .filter(msg => msg.trim().length > 0)
            .map(msg => msg.trim())
    }

    const handleMessageClick = (message: string) => {
        form.setValue("content", message, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send Anonymous Message to {userName}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className="my-4"
                        disabled={isSuggestLoading}
                    >
                        Suggest Messages
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {error ? (
                            <p className="text-red-500">{error.message}</p>
                        ) : (
                            parseStringMessages(completion).map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    );

}

export default page;