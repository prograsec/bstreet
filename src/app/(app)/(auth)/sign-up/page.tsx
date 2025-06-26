import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { redirect } from "next/navigation";
import { caller } from "@/trpc/server";

const Page = async () => {
  const session = await caller.auth.session(); //caller is a function that can be called from the client. It is a proxy to the server. It is used to call the server procedures from the client. auth.session is the procedure that is called to get the session data. it is defined in the server/procedures.ts file.
  if (session.user) {
    redirect("/");
  }
  return <SignUpView />;
};

export default Page;
