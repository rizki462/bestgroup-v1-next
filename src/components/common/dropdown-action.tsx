import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function DropdownAction({
  menu,
}: {
  menu: {
    label: string | React.ReactNode;
    variant?: "default" | "destructive";
    action?: () => void;
    type?: "button" | "link";
  }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground" size='icon'>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        {menu.map((item, index) => {
          return (
            <DropdownMenuItem
              key={`dropdown-menu-${index}`}
              onClick={item.action}
              asChild={item.type === "link"}
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
