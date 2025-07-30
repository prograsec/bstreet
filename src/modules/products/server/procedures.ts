import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Where } from "payload"

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure.input(
    z.object({
      category: z.string().nullable().optional(),
    }),
  )
  .query(async ({ctx, input}) => {
    const where:Where ={}

    //Its trying to fetch the category from collections before giving where clause in .query() to check whether the category exists or not.
    if(input.category) {
      const categoryData = await ctx.db.find({
        collection: "categories",
        limit: 1,
        pagination: false,
        where:{
          slug:{
            equals: input.category
          }
        }
      })

      const category = categoryData.docs[0];
      if(category){
        where["category.slug"] = {
          equals: category.slug  //Now here assigning the slug of the category to the where clause
        }
      }
    }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1,
        where
      });

      return data;
  }),
});

//procedures.ts is where you define the functions that will be called from the client
//It is a server only file, so it cannot be imported into the client 


/* What does src/modules/categories/server/procedures.ts do?
It declares all server-side “procedures” (endpoints) that relate to the Categories domain.
Those procedures are collected into a tRPC router (categoriesRouter) so the rest
of your app—or the browser via the tRPC client—can call them in a type-safe way.
Because it sits inside server/, everything exported here runs only on the server; the client consumes it indirectly via the generated tRPC hooks.

What is categoriesRouter?
It’s an instance of a tRPC router created by calling createTRPCRouter({ ... }).
Think of it as a miniature API server that groups all category-related endpoints under a common namespace.
Anything you define inside the object (getMany in this case) becomes a callable endpoint whose full path will be something 
like categories.getMany (depending on how you mount the router in your root app router).

What is a tRPC router in general?
In the tRPC library, a router is a container that groups multiple procedures (queries, mutations, subscriptions).
Routers can be nested and composed, allowing you to build a type-safe, hierarchical API without writing HTTP handlers or GraphQL schemas.
When you register a router on the server and import it on the client, tRPC generates strongly-typed hooks (e.g., trpc.categories.getMany.useQuery) for you automatically.

What is getMany?
It’s a single procedure defined inside categoriesRouter.
Marked with .query(...), so it’s a read-only operation (analogous to a GET request).
The resolver currently returns a placeholder array ([{ hello: "world" }]); in a real app you’d fetch and return a list of Category records from your database.

What is baseProcedure?
Exported from src/trpc/init.ts, it’s essentially t.procedure from @trpc/server but aliased for convenience.
A procedure builder: you chain .query(), .mutation(), or .subscription() onto it to define what the procedure does.
Because it’s created from a shared initTRPC instance, every procedure automatically inherits global config such as context typing, middleware, and data transformers—keeping the API consistent and type-safe across your app.


*/