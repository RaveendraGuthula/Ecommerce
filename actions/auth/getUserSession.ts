"use server";

import { fetchApiclient } from "@/lib/oneentry";

import { cookies } from "next/headers";

interface IError{
    statusCode:number;
    message:string;
}

export default async function getUserSession(){
    const apiClient =await fetchApiclient();
    const accessToken = (await cookies()).get("access_token")?.value;

    if(!accessToken){
        console.warn("No access token found in cookies.");
        return null;
    }


    try{
        const currentUser =await apiClient?.Users.setAccessToken(accessToken).getUser();

        console.log("Current user:", currentUser);
        if(!currentUser || !currentUser.id){
            throw new Error("Invalid user data or missing user ID.");
        }
        return currentUser;
    }
    catch(err:unknown){
        //change err type to "unknown"
        if(err instanceof Error &&(err as unknown as IError).statusCode ===401){
            return undefined;
        }
        console.error("Failed to retrieve use session:" , err);
    }

}