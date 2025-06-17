import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CustomCategory } from "../types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void; //This means the parent component is closing the sheet. Void means we don't care about the value of open.
  data: CustomCategory[];
}

export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  console.log(data);
  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  //If we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setParentCategories(null);
    setSelectedCategory(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]); //Now subcategories are the parent categories. Parentcategories refers to visible area of sidebar.
      setSelectedCategory(category);
    } else {
      // If user has clicked on a sub category
      //This is a leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        //This is a sub category navigate to /category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        //This is a main category. navigate to /category
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    setParentCategories(null);
    setSelectedCategory(null);
  };

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}

          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium"
            >
              {category.name}

              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

//Summary of this component:
//It gets the data from the parent component.
//Set an empty state for the parent categories. Here parent categories are the categories that are visible in the sidebar.
//Set an empty state for the selected category.
//Set current categories to the parent categories if they exist, otherwise set it to the data. At first render, it'll be the data.
//Iterate over the current categories and render a button for each category.
//If user clicks on a category, take its subcategories and set them as the parent categories.Make this category the selected category.
//If user clicks on a sub category, take its slug and navigate to /category/subcategory.
