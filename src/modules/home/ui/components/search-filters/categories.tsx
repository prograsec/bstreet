"use client";

import { CategoryDropdown } from "./category-dropdown";
// import { CustomCategory } from "../types";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useParams } from "next/navigation";
interface CategoriesProps {
  data: CategoriesGetManyOutput;
}

export const Categories = ({ data }: CategoriesProps) => {
  const params = useParams(); // This is the client way of getting the params.
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the container div
  // This can be used for positioning or other purposes if needed
  //useRef is used in React to create a mutable object that persists for the full lifetime of the component.
  // It can be used to access DOM elements or store mutable values without causing re-renders.
  //Mutable means that the value can change without triggering a re-render of the component.
  // In this case, it is used to reference the container div that wraps around the category buttons.

  const measureRef = useRef<HTMLDivElement>(null); // Reference to the measure div
  // This can be used for measuring the width of the container or other purposes if needed

  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length); // State to keep track of how many categories are visible
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryIndex = data.findIndex(
    (cat) => cat.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;
  // Checks if the active category is hidden based on the visible count
  // activeCategoryIndex !== -1 ensures that the active category exists in the data array

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
        return;
      }

      const containerWidth = containerRef.current.offsetWidth; //containerRef refers to the container div that wraps around the category buttons
      // offsetWidth returns the layout width of an element as an integer, including padding and border, but not margin.
      // This will be used to calculate how many category buttons can fit in the available width
      // .current is used to access the current value of the ref, which is the DOM element it references.
      const viewAllWidth = viewAllRef.current.offsetWidth;
      // viewAllRef refers to the "View All" button, which is used to determine how much space is taken up by it
      // offsetWidth returns the width of the element, including padding and border, but not margin.
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children); // Get all child elements of the measureRef
      // This will be used to calculate the total width of the items and determine how many can fit in the available width
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width; //getBoundingClientRect() returns the size of an element and its position relative to the viewport.
        //example output: {width: 100, height: 50, top: 10, left: 20, right: 120, bottom: 60}
        // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_element_getboundingclientrect

        if (totalWidth + width > availableWidth) break; // If adding the next item exceeds the available width, stop counting
        totalWidth += width; // Add the width of the current item to the total width
        visible++; // Increment the count of visible items
      }

      setVisibleCount(visible); // Update the visible count state
    };

    const resizeObserver = new ResizeObserver(calculateVisible); // ResizeObserver is used to observe changes in the size of an element
    // It will call the calculateVisible function whenever the size of the container changes
    resizeObserver.observe(containerRef.current!); // Observe the container element for size changes

    return () => resizeObserver.disconnect();
  }, [data.length]); // Recalculate visible items when the data length changes

  return (
    <div className="relative w-full">
      {/* Wrapper around the categories. This is what categories component is exporting */}

      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        // data={data}
      />
      {/* It takes two props: open and onOpenChange. open is a boolean that determines if the sidebar is open or not, and onOpenChange is a function that will be called when the sidebar is opened or closed */}

      {/* Hidden Div to measure all the items */}
      <div
        ref={measureRef} // Reference to the measure div
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {data.map((category) => {
          //Iterates over the categories
          return (
            <div key={category.id}>
              <CategoryDropdown // Renders the CategoryDropdown component. Returns a button for each category.
                category={category}
                isActive={activeCategory === category.slug}
                // Checks if the active category matches the current category's slug which means it is the currently selected category
                isNavigationHovered={false}
              />
            </div>
          );
        })}
      </div>

      {/* Wrapper around the categories.*/}
      <div
        ref={containerRef} // Reference to the container div
        onMouseEnter={() => setIsAnyHovered(true)} // Sets isAnyHovered to true when the mouse enters the container
        onMouseLeave={() => setIsAnyHovered(false)} // Sets isAnyHovered to false when the mouse leaves the container
        className="flex flex-nowrap gap-1 items-center"
      >
        {data.slice(0, visibleCount).map((category) => {
          //Iterates over the categories
          return (
            <div key={category.id}>
              <CategoryDropdown // Renders the CategoryDropdown component. Returns a button for each category.
                category={category}
                isActive={activeCategory === category.slug}
                // Checks if the active category matches the current category's slug which means it is the currently selected category
                isNavigationHovered={isAnyHovered}
              />
            </div>
          );
        })}

        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant="elevated"
            className={cn(
              "h-11 px-4 bg-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-primary"
            )}
            onClick={() => setIsSidebarOpen(true)} // Toggles the sidebar open state when the button is clicked
          >
            View All <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
