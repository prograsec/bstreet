import { headers as getHeaders } from "next/headers"; //headers is used to get the headers of the request. Http headers provides information about the meta data of api requests and its response.
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { generateAuthCookie } from "../utils";
import { registerSchema, loginSchema } from "../schemas";


export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers }); //Take the headers and return user information
    return session;
  }),
  
  //We don't require logout for now
  register: baseProcedure.input(//registerSchema is the schema for the register procedure or the zod object that is passed to the procedure for validation
    registerSchema 
  ).mutation(async ({ctx, input}) => {
    const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where:{
            username:{
                equals: input.username,
            }
        },
        select:{
            username: true,
        }
    })

    const existingUser = existingData.docs[0];

    if(existingUser){
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists",
        })
    }
    
    await ctx.db.create({
        collection: "users",
        data:{
            email: input.email,
            username: input.username, 
            password: input.password,
        }

    });

    const data = await ctx.db.login({
        collection: "users",
        data:{
            password: input.password,
            email: input.email,
        }
    })

    if(!data.token){
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
        })
    }

    await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
    });
    
  }),
  login: baseProcedure.input(
    loginSchema
  ).mutation(async ({ctx, input}) => {
    const data = await ctx.db.login({
        collection: "users",
        data:{
            password: input.password,
            email: input.email,
        }
    })

    if(!data.token){
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
        })
    }

    await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
    });

    return data;
  }),
});
