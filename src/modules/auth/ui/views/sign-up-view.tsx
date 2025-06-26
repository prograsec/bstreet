"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

import { registerSchema } from "@/modules/auth/schemas";
// import { useRouter } from "next/navigation";

export const SignUpView = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    register.mutate(values); // mutate function is used to call the mutation function. here mutation function is the register function.
  };

  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;

  const showPreview = username && !usernameErrors; //this is used to show the preview of the username. if the username is not empty and there are no errors, then show the preview.

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter()); //invalidate the session query to get the latest session data which rerender the page
        router.push("/");
      },
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span
                  className={cn("text-2xl font-semibold", poppins.className)}
                >
                  BStreet
                </span>
              </Link>
              <Button asChild variant="ghost" size="sm">
                <Link href={"/sign-in"}>Sign In</Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">
              Join over 500 creators, earning money on BStreet
            </h1>

            {/* Form Fields */}

            <FormField
              control={form.control} //this is the form control. it is used to control the form state. It works with the form state and the form fields.
              name="username"
              render={(
                { field } //this is the render function. it is used to render the form field. 'field' is the form field.
              ) => (
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your store will be available at &nbsp;
                    <strong>{username}</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={register.isPending}
              type="submit"
              variant="elevated"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              size="lg"
            >
              Create Account
            </Button>
          </form>
        </Form>
      </div>

      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

/*
give a beginner friendly defination of this <z.infer<typeof registerSchema>> that what is meant
by these <> greater/less signs after useForm 
what is meant by 'infer'
what is meant by 'typeof
what is the pattern of passing default value in useFrom hook


1. The <> (Angle Brackets) - Generics
The <> symbols are called generics in TypeScript. Think of them like a placeholder that tells TypeScript "what type of data will this work with?"

// Without generics (basic)
const numbers = [1, 2, 3]; // TypeScript knows this is number[]

// With generics (more flexible)
const form = useForm<UserData>(); // Tell useForm it will work with UserData type

2. z.infer<typeof registerSchema> - What does infer mean?
infer is a Zod utility that automatically figures out the TypeScript type from your Zod schema

// Let's say your registerSchema looks like this:
const registerSchema = z.object({
  email: z.string(),
  password: z.string(),
  username: z.string(),
});

// z.infer<typeof registerSchema> automatically becomes:
type InferredType = {
  email: string;
  password: string;
  username: string;
}

3. typeof - Getting the Type

typeof gets the type of a value (not the actual value).


const registerSchema = z.object({...}); // This is a value

typeof registerSchema // This is the TYPE of that value

const registerSchema = z.object({...}); // This is a value

typeof registerSchema // This is the TYPE of that value


4. Default Values Pattern in useForm

The defaultValues pattern provides initial values for your form fields:

const form = useForm<FormType>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: "",        // Start with empty email
    password: "",     // Start with empty password  
    username: "",     // Start with empty username
  },
});


Putting It All Together

const form = useForm<z.infer<typeof registerSchema>>({
  resolver: zodResolver(registerSchema),
  defaultValues: {
    email: "",
    password: "",
    username: "",
  },
});


In plain English:
"Create a form that works with data matching my registerSchema structure"
"Use Zod to validate the form data"
"Start with empty strings for all fields"
The beauty is that TypeScript will now give you autocomplete and catch errors because it knows exactly what shape your form data should have!
*/
