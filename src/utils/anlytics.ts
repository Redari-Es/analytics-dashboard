import { redis } from "@/lib/redis"
import { getDate } from "@/utils"
import { parse } from "date-fns"

type AnalyticsArgs = {
    retention?:number
}

type TrackOptions = {
    persist?:boolean
}

export class Analytics{
    private retention:number=60*60*24*7
    
    constructor(opts?: AnalyticsArgs) {
        if (opts?.retention) this.retention=opts.retention
    }
    // track
    async track(namespace: string, event: object = {},opts?:TrackOptions) {

        let key=`analytics::${namespace}`
        
        if (!opts?.persist) {
            key+=`::${getDate()}`
        }
        // db call to persist this event
        await redis.hincrby(key,JSON.stringify(event),1)
        // console.log("set")
        
        if(!opts?.persist)await redis.expire(key,this.retention)
    }
    // multidate
    async retrieveDays(namespace: string, nDays: number) {
        type AnalyticsPromise=ReturnType<typeof analytics.retrieve>
        const promises:AnalyticsPromise[]=[]
        for (let i = 0; i < nDays; i++){
            const formatteDate=getDate(i)
            const promise=  analytics.retrieve(namespace,formatteDate)
            promises.push(promise)
        }
        const fetched =await Promise.all(promises)
        const data = fetched.sort((a, b) => {
            if (
                parse(a.date, "dd/MM/yyyy", new Date()) >
                parse(b.date, "dd/MM/yyyy", new Date())
            ) {
                return 1
            } else {
                return -1
            }
        })
        return data
    }

    // retrieve
    async retrieve(namespace: string,date:string) {
        const res = await redis.hgetall<Record<string,string>>(`analytics::${namespace}::${date}`)
        // const res = await redis.hgetall(`analytics::${namespace}::${date}`);
        return {
            date,
            events: Object.entries(res ?? []).map(([key, value]) => ({
                [key]:Number(value)
            })),
        }
    }
}

export const analytics=new Analytics()