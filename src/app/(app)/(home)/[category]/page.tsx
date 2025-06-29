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

const Page = async ({}: Props) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;

//<HydrationBoundary> is a component that is used to hydrate the client side of the application.
// Props are passed so that the client side of the application can use the same props as the server side of the application.
//Hydrate means to convert the server side of the application to the client side of the application.
//<Suspense> is a component that is used to show a fallback component while the data is loading.
