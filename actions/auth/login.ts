"use server";

import { IAttributes } from "oneentry/dist/base/utils";
import { fetchApiclient } from "@/lib/oneentry";

import { cookies } from "next/headers";

import { redirect } from "next/navigation";

interface IErrorResponse {
    statusCode: number;
    message: string;
}   

export const getLoginFormData=async():Promise<IAttributes[]>=>{

    try{
        const apiClient = await fetchApiclient();
        const formData = await apiClient?.Forms.getFormByMarker('sign_in', 'en_US');
        return formData?.attributes as unknown as IAttributes[];
    }
    catch(error){
        console.error("Error fetching login form data:", error);
        throw new Error("Failed to fetch login form data");
    }
}



export const handleLoginSubmit=async(inputValues:{
    email:string;
    password:string;
})=>{
    try{
        const apiClient = await fetchApiclient();
        
        const data={
            authData:[
                {marker:"email", value:inputValues.email},
                {marker:"password", value:inputValues.password},
            ],
        };

        const response =await apiClient?.AuthProvider.auth("email",data);       //here email is login user email address

        if(!response?.userIdentifier){
            const error= response as unknown as IErrorResponse;

            return{
                message:error.message,
            };
        }

        (await cookies()).set("access_token", response.accessToken,{
            maxAge: 60* 60 * 24, // 1 day
        });

        ((await cookies()).set("refresh_Token",response.refreshToken,{
            maxAge: 60 * 60 * 24 * 7, // 7 days
        }));

    }
    catch(error:any){
        console.error("Error during login submission:", error);

        if(error?.statusCode === 401){
            return {
                message:error?.message || "Unauthorized access. Please check your credentials.",
            };
        }
        throw new Error("Login failed. Please try again later.");
    }
    redirect("/");
}