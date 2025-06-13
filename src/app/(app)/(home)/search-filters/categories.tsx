import { Category } from "@/payload-types";
import { CategoryDropdown } from "./category-dropdown";

interface CategoriesProps {
  data: any;
}

export const Categories = ({ data }: CategoriesProps) => {
  return (
    <div className="relative w-full">
      {/* Wrapper around the categories. Parent of category buttons */}
      <div className="flex flex-nowrap items-center">
        {data.map((category: Category) => {
          //Iterates over the categories
          return (
            <div key={category.id}>
              <CategoryDropdown // Renders the CategoryDropdown component. Returns a button for each category.
                category={category}
                isActive={false}
                isNavigationHovered={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
