import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({ items, open, onOpenChange }: props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle className="text-2xl font-semibold">BStreet</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => {
            return (
              <Link
                href={item.href}
                key={item.href}
                className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              >
                {item.children}
              </Link>
            );
          })}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
