import { analytics } from "@/utils/anlytics";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname === '/') {
       // track event 
        try {
            analytics.track("pageview", {
                page: '/',
                country:req.geo?.country,
                // name:"ShonH"
            }
            ) 
        } catch(err) {
           console.error(err) 
        }
    }
    return NextResponse.next()
}

export const matcher = {
    matcher:['/'],
}