"use server";

import {cookies} from "next/headers";
export default async function storeRefreshToken(token: string) {
    const cookiesStore=await cookies();
    return cookiesStore.set("refresh_Token", token, );
}