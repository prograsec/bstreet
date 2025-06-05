import { Category } from "@/payload-types";

interface Props {
  category: Category;
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
        <div className="w-60 text-black rounded-md overflow-hidden border">
          <p>Subcategory Menu</p>
        </div>
      </div>
    </div>
  );
};
