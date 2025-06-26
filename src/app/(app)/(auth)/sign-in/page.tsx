import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await caller.auth.session(); //caller is a function that can be called from the client. It is a proxy to the server. It is used to call the server procedures from the client. auth.session is the procedure that is called to get the session data. it is defined in the server/procedures.ts file.
  if (session.user) {
    redirect("/");
  }
  return <SignInView />;
};

export default Page;
