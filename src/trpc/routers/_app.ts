
import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { authRouter } from '@/modules/auth/server/procedures';

export const appRouter = createTRPCRouter({
 auth: authRouter,
 categories: categoriesRouter, // Here categories is the name of the router and categoriesRouter is the router that will be used to call the functions
});
// export type definition of API
export type AppRouter = typeof appRouter;

/* What is appRouter?
It’s the root router that combines all your domain routers (e.g., categoriesRouter) into a single, top-level API.
When you import it on the client, it gives you a single entry point to all your API endpoints.

What is categoriesRouter?
It’s the router that groups all category-related endpoints under a common namespace.

*/