"use server";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const handleSignin = async (formData:FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const checkResult = await prisma.user.findUnique({
        where:{
            email:email,
            password:password,
        }
    })
    console.log(checkResult,email,password);
    if(checkResult !== null) return {userId:checkResult.id,success:true};

    try{
        const result =  await prisma.user.create({
            data:{
                email:email,
                password:password,
            }
        });
    return {userId:result.id,success:true}
    }catch(err){
        return {message:"email is already in use",success:false}
    }
}