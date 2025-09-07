"use client";

import { insertTodo } from "../server/insert-todo"
import { useActionState } from "react";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export const AddTodoSection = ({setArray}:any) => {
    const action = async (_:unknown,formData:FormData) => {
        const userId = localStorage.getItem("userId") as string;
        const result = await insertTodo(formData,parseInt(userId));

        const options: Intl.DateTimeFormatOptions = { 
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }
        console.log(result.success);
        if(result.success){
            const newTodo = {
                id: result.id,
                userId: parseInt(userId),
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                createdAt: new Date(),
                limit: new Date(formData.get("limit") as string)
            };

            console.log("Adding new todo:", newTodo);
            setArray((prev:any) => {
                const array = [...prev];
                array.unshift(newTodo);
                return array;
            })
        }

        return result;
    }

    const [state,formAction,isPending] = useActionState(action,null);

    useEffect(()=>{
        if(!localStorage.getItem("userId")){
            redirect("/login");
        }
    },[]);

return <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-4">
        <h1 className="text-xl font-semibold">Add a new todo</h1>
        <p className="text-sm text-gray-500 mt-1">Keep it short and clear.</p>

        <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <input name="title" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200" type="text" placeholder="Title"/>
          </div>
          <div className="sm:col-span-2">
            <input name="description" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200" type="text" placeholder="Description"/>
          </div>
          <div className="sm:col-span-1">
            <input required min={(() => {
                const date = new Date();
                date.setHours(date.getHours() + 1); // add 1 hour
                return date.toLocaleString("sv-SE", { 
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
                }).replace(" ", "T");
            })()} name="limit" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200" type="datetime-local" placeholder="Limited Date" />
          </div>
          <div className="sm:col-span-1 flex items-end">
            <button className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
              {isPending ? "Adding..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
}