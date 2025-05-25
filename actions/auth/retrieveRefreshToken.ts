"use server";

import {cookies} from "next/headers";
export default async function retrieveRefreshToken() {
    const cookiesStore=await cookies();
    return cookiesStore.get("refresh_Token")?.value;
}
