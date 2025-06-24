import { headers as getHeaders, cookies as getCookies } from "next/headers"; //headers is used to get the headers of the request. Http headers provides information about the meta data of api requests and its response.
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "../constants";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers }); //Take the headers and return user information
    return session;
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),
  register: baseProcedure.input(
    z.object({
        email: z.string().email(),
        password: z.string().min(3),
        username: z
          .string()
          .min(3, "Username must be at least 3 characters")
          .max(63, "Username must be less than 63 characters")
          .regex(
            /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
            "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number"
          ).refine((val)=>val.toLowerCase()),
      })
  ).mutation(async ({ctx, input}) => {
    
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

    const cookies = await getCookies();
    cookies.set("session", data.token, {
        name:AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
    });
    
  }),
  login: baseProcedure.input(
    z.object({
        email: z.string().email(),
        password: z.string(),
        
      })
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

    const cookies = await getCookies();
    cookies.set("session", data.token, {
        name:AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
    });

    return data;
  }),
});
