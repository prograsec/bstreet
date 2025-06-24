"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());

  // return <div>{JSON.stringify(data, null, 2)}</div>;
  return <div>{JSON.stringify(data?.user, null, 2)}</div>;
}

// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";

// export default function Home() {
// const trpc = useTRPC();
// const categories = useQuery(trpc.categories.getMany.queryOptions());
// In trpc.categories.getMany.queryOptions() categories is the queryKey and it refers
// to the router in _app.ts it is located in procedures.ts in the categoriesRouter there it is called getMany
// The queryOptions() is a function that returns an object with the queryKey and queryFn
// The queryKey is an array of strings that uniquely identify the query
// The queryFn is a function that returns the data for the query
// The queryFn is executed when the query is fetched
// The queryFn is executed in the server
// Here in this scnario queryFn is located in procedures.ts in the categoriesRouter there it is called getMany
// return <div>Home Page</div>;
// }
