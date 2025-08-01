import { Category } from "@/payload-types";
// import { CustomCategory } from "../types";
import Link from "next/link";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
  position: {
    top: number;
    left: number;
  };
}

export const SubcategoryMenu = ({ category, isOpen, position }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#f5f5f5"; // Default color if not specified
  return (
    <div
      className="fixed z-50"
      style={{ top: position.top, left: position.left }}
    >
      <div className="h-3 w-60">
        {/* created a space between the button and the menu */}
        <div
          style={{ backgroundColor: backgroundColor }}
          className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_4px_rgba(0,0,0,1)]
        -translate-x-[2px] -translate-y-[2px]"
        >
          <div>
            {category.subcategories?.map(
              (
                subcategory: Category //Subcategories are rendered as links
              ) => (
                <Link
                  key={subcategory.slug}
                  href={`/${category.slug}/${subcategory.slug}`}
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
                >
                  {subcategory.name}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
