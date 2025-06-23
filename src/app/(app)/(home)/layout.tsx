import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters, SearchFiltersLoading } from "./search-filters";

interface Props {
  children: React.ReactNode;
}

async function Layout({ children }: Props) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()); //This prefetch means server will fetch the data before the client requests it

  // Example of resulting structure given by copilot.
  // [
  //   {
  //     id: "1",
  //     name: "Electronics",
  //     subcategories: [
  //       { id: "sub1", name: "Phones", subcategories: undefined },
  //       { id: "sub2", name: "Laptops", subcategories: undefined }
  //     ]
  //   },
  //   {
  //     id: "2",
  //     name: "Clothing",
  //     subcategories: [
  //       { id: "sub3", name: "Men's", subcategories: undefined },
  //       { id: "sub4", name: "Women's", subcategories: undefined }
  //     ]
  //   }
  // ]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      {/* Main content area */}
      <div className="flex-1 bg-[#f4f4f0]">{children}</div> <Footer />
    </div>
  );
}

export default Layout;
