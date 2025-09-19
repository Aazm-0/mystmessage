"use client"
import { useSession, signOut } from "next-auth/react";
import React from "react";
import Link from "next/link";
import { User } from "next-auth"
import { Button } from "./ui/button";



function Navbar() {
    const { data: session } = useSession();
    // The reason you might need to cast session.user to User is that the session object returned by useSession
    // so to type cast it as User you can essentially properly know what it holds
    const user: User = session?.user as User;
    // we are renaming the data to session so its easier to understand

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className='text-xl font-bold mb-4 md:mb-0' href="#">Mystery Message</a>
                {
                    session ? (
                        <>
                            <span>Welcome {user.userName || user.email}</span>
                            <Button className="w-full md:w-auto" onClick={() => signOut()}>LogOut</Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="w-full md:w-auto">LogIn</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    );
}

export default Navbar;