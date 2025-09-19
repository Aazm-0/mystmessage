"use client"

import { useCallback, useEffect, useState } from "react";
import { Message, User } from "@/models/User.model";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { Switch } from "@/components/ui/switch";

function page() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isMessageLoading, setIsMessageLoading] = useState(false)
    // seperate loader for switch for accepting message
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { data: session } = useSession()
    const user: User = session?.user as User

    // Optimistic UI: Changes ui even if server change hasnt happened still
    // we can use it to delete the messsage ui from here even if server calls still left
    const handleDeleteMessage = (messageID: string) => {
        setMessages(messages.filter(message => message._id !== messageID))
    }

    // Set up zod for the switch button
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    // We can destructure the form to get register watch and setValue as we are now manually doing it
    const { watch, setValue, register } = form
    // register to register a field watch to watch the field for updates and get them and setValue to change the value in it 

    const acceptMessages = watch('acceptMessage')
    
    // You could memoize the function using useCallback but most new react engine do it themselves and also new hook coming out for this
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true)    
        try {
            const response = await axios.get<ApiResponse>("/api/accept-messages")
            setValue("acceptMessage",response.data.isAcceptingMessages as boolean)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Axios Error",{
                description: axiosError.response?.data.message || "Failed to Fetch Message Status"
            }) 
        } finally {
            setIsSwitchLoading(false)
        }
    } ,[setValue])

    const fetchMessages = useCallback(async (refresh : boolean = false) => {
        setIsSwitchLoading(false)
        setIsMessageLoading(true)
        try {
            const response = await axios.get<ApiResponse>("/api/get-messages")
            setMessages(response.data.messages || [])
            if(refresh){
                toast("Refreshed Messages",{
                    description: "Showing Latest Messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Axios Error",{
                description: axiosError.response?.data.message || "Failed to Fetch Message"
            }) 
        } finally {
            setIsMessageLoading(false)
            setIsSwitchLoading(false)
        }
    },[setIsSwitchLoading,setIsMessageLoading])

    useEffect(() => {
        if(!session || !session.user){
            return
        }

        fetchMessages()
        fetchAcceptMessages()
    } ,[session,setValue,fetchAcceptMessages,fetchMessages])


    // handling switch change
    const handleSwitchChange = async() => {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-messages",{
                acceptMessages : !acceptMessages
            })
            setValue("acceptMessage",!acceptMessages)
            toast(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Axios Error",{
                description: axiosError.response?.data.message || "Failed to Fetch Message"
            }) 
        }
    }

    // Hard coded link
    const userName = session?.user.userName 
    const profileUrl = `${window.location.protocol}//${window.location.host}/u/${userName}`
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast("Copied To Clipboard", {
            description: "Url has been copied to clipboard"
        })
    }

    if(!session || !session.user){
        <div>Please Log In</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isMessageLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    );
}

export default page;