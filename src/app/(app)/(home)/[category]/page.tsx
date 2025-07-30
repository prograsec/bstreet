import { getQueryClient, trpc } from "@/trpc/server";
import {
  ProductList,
  ProductSkeleton,
} from "@/modules/products/ui/components/product-list";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    //Because it is a dynamic route, the params are not resolved until the page is rendered.
    //It is a server component, so we need to use async await to get the params.
    category: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { category } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ category })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;

//<HydrationBoundary> is a component that is used to hydrate the client side of the application.
// Props are passed so that the client side of the application can use the same props as the server side of the application.
//Hydrate means to convert the server side of the application to the client side of the application.

//Difference between useSuspenseQuery and useQuery
/*useQuery (standard way)
You manually handle loading and error states.

Works without enabling React Suspense.

Good for traditional React apps.



useSuspenseQuery (used with React Suspense)
Doesn't return isLoading or error.

Instead, automatically throws a Promise while loading, which is caught by a <Suspense> boundary.

You must use it inside a <Suspense> component.

Useful when you want to keep your UI cleaner and rely on React to handle the loading state.


***If you use useSuspenseQuery without wrapping it inside <Suspense>, your app will break.
***Error handling with useSuspenseQuery requires an Error Boundary.

*/
