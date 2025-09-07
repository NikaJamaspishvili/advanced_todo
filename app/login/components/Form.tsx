"use client";
import { useActionState } from "react";
import { handleSignin } from "@/app/server/login-actions";
import { redirect } from "next/navigation";

const Form = () => {
    const action = async (_:unknown,formData:FormData) => {
        const result = await handleSignin(formData);
        if(result.userId){
            localStorage.setItem("userId",String(result.userId))
            redirect("/");
        };
        return result;
    }

    const [state,formAction,isPending] = useActionState(action,null);
  return (
    <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <button
            className="w-full inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            type="submit"
          >
            {isPending ? "Loading..." : "Sign in"}
          </button>
          {state?.message && <p>{state?.message}</p>}
    </form>
  )
}

export default Form