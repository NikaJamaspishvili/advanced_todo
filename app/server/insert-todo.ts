"use server";
import { PrismaClient } from "../generated/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

export const insertTodo = async (data: FormData,userId:number) => {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const limit = new Date(data.get("limit") as string).toISOString();

    try{
        const result = await prisma.todo.create({
            data:{
                title:title,
                userId:userId,
                description:description,
                limit:limit,
            }
        });
        return {success:true,id:result.id}
    }catch(err){
        return {success:false}
    }
    
    // Revalidate the cache for this specific user
    revalidatePath(`/`);
}



export const getTodos = async (userId:number) => {
        const array = await prisma.todo.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return array;
}

export const deleteTodos = async (id:number) => {
    try{

        // const timer = await new Promise((resolve) => setTimeout(()=> resolve("hello"),5000));
        // console.log(timer);
        await prisma.todo.deleteMany({
            where:{
                id:id,
            }
        })
    }catch(err){
        console.log(err);
        throw new Error("error while deleting todo...");
    }
}