import { RefObject } from "react"

export const useDropdownPosition = (ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>) => { 
    const getDropdownPosition = () => {
        if(!ref.current) return { top: 0, left: 0 };

        const rect = ref.current.getBoundingClientRect();
        const dropdownWidth = 240; // Example width of the dropdown (w-16 = 15rem = 240px)

        let left = rect.left + window.scrollX;
        const top = rect.bottom + window.scrollY;

        if(left + dropdownWidth > window.innerWidth) {
            //Align to the right side of the button if it exceeds the window width
            left = rect.right + window.scrollX - dropdownWidth;

            // If it goes off the left edge, adjust to the right side of the screen
            if(left < 0) {
                left = window.innerWidth - dropdownWidth - 16;
            }
        }

        if (left < 16) {
            left = 16; // Ensure it doesn't go off the left edge
        }

        return { top, left };
    };

    return { getDropdownPosition };
}