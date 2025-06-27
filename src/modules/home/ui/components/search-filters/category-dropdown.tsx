"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRef } from "react";
import { SubcategoryMenu } from "./subcategory-menu";
import { useDropdownPosition } from "./use-dropdown-position";
// import { CustomCategory } from "../types";
import Link from "next/link";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  category: CategoriesGetManyOutput[1];
  //category: CustomCategory; Using CustomCategory type to include subcategories 'CustomCategory' is a type that extends 'Category' and includes an optional 'subcategories' property.
  isActive: boolean;
  isNavigationHovered: boolean;
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (category.subcategories?.length) {
      setIsOpen(!isOpen);
    }
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <div //Wrapper around button component
      className="relative" // Made the position relative to allow absolute positioning of the dropdown arrow
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      <Button
        variant="elevated"
        className={cn(
          "h-11 px-4 bg-transparent rounded-full hover:bg-white hover:border-primary text-black",
          isActive && !isNavigationHovered && "bg-white border-primary",
          isOpen &&
            "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px]"
        )}
      >
        <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
          {category.name}
        </Link>
      </Button>
      {category.subcategories && category.subcategories.length > 0 && (
        <div // Dropdown arrow
          className={cn(
            "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
            isOpen && "opacity-100"
          )}
        ></div>
      )}

      <SubcategoryMenu // Renders the SubcategoryMenu component
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};
