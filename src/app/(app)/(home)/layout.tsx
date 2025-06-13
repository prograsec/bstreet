import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters } from "./search-filters";
import { Category } from "@/payload-types";
import { Pagination } from "@/components/ui/pagination";

interface Props {
  children: React.ReactNode;
}

async function Layout({ children }: Props) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    pagination: false,
    depth: 1,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

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
      <SearchFilters data={formattedData} />
      {/* Main content area */}
      <div className="flex-1 bg-[#f4f4f0]">{children}</div> <Footer />
    </div>
  );
}

export default Layout;
