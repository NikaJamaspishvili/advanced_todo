"use client";
import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { getTodos,deleteTodos } from "../server/insert-todo";
import { AddTodoSection } from "./AddTodoSection";

  interface Array { 
    id: number; 
    userId: number; 
    title: string; 
    description: string; 
    createdAt: Date; 
    limit: Date | null; 
  }
  
const Fetch = () => {
    const [array,setArray] = useState<Array[]>([]);
    const [isPending,setIsPending] = useState<number | null>(null);
    const [currentTimeZone,setCurrentTimeZone] = useState("Georgia");

    const times: Record<string, string> = {
        "en-US": "America/New_York",   // U.S. Eastern Time
        "ka-GE": "Asia/Tbilisi",       // Georgia (Tbilisi)
        "it-IT": "Europe/Rome",        // Italy (Rome)
        "en-AU": "Australia/Sydney",   // Australia (Sydney, common choice)
    };
    
    useEffect(()=>{
        async function fetch(){
            const result = await getTodos(parseInt(localStorage.getItem("userId") as string));
            console.log("aldready fetched: ",result);
            setArray(result);
        }

        fetch();
    },[])

    async function handleDelete(id:number){
        if(isPending !== null) return;
        // console.log(id);
        setIsPending(id);
        if(id) await deleteTodos(id);

        setArray((prev:any) => {
            const array = [...prev];
            const newArray = array.filter(item => item.id !== id);
            return newArray;
        })

        setIsPending(null);
    }

  return (
    <>
    <section className="mb-6">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <label className="text-sm font-medium text-gray-700">Timezone:</label>
          <select 
            value={currentTimeZone}
            onChange={(e) => {setCurrentTimeZone(e.target.value)}}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="ka-GE">🇬🇪 Georgia (GET)</option>
            <option value="en-US">🇺🇸 America (EST)</option>
            <option value="it-IT">🇮🇹 Italy (CET)</option>
            <option value="en-AU">🇦🇺 Australia (AEST)</option>
          </select>
        </div>
    </section>
    <section className="mb-10">
        <AddTodoSection setArray={setArray}/>
    </section>

    {array.length === 0 ? <div className="text-center text-2xl font-bold">No Results Found</div> : <section className="space-y-4">
          {array.map((result,index) => {
            const options: Intl.DateTimeFormatOptions = { 
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: times[currentTimeZone]
            }
            const start = new Date();
            const end = new Date(result.limit as Date);

            const timeLeft = intervalToDuration({start,end});
            let timeLeftString = "";
            if(timeLeft.days) timeLeftString += `${timeLeft.days} Day `
            if(timeLeft.hours) timeLeftString += `${timeLeft.hours} Hour `
            if(timeLeft.minutes) timeLeftString += `${timeLeft.minutes} Minute `

            const createdAt = result.createdAt.toLocaleString(currentTimeZone,options);
            const limit = result.limit?.toLocaleString(currentTimeZone,options);

            if(timeLeftString.length === 0) return null;

           return <div key={index} className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-medium leading-snug">{result.title}</h2>
                    <p className="mt-1 text-sm text-gray-600">{result.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">Todo #{index+1}</span>
                    <button disabled={isPending === result.id} type="button" onClick={()=>handleDelete(result.id)} className="inline-flex items-center justify-center rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {isPending === result.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    <p>Created: {createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
                    <p>Limit: {limit}</p>
                  </div>
                  <div className="ml-auto text-gray-800 font-medium">Time Left: {timeLeftString}</div>
                </div>
              </div>
            </div>
          })}
    </section>}
    </>
  )
}

export default Fetch