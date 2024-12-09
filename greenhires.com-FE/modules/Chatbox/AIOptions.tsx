import {
  Check,
  Paragraph,
  PencilCircle,
  SortAscending,
  SortDescending,
  TextAa,
} from "@phosphor-icons/react";
import { forwardRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface Props {
  setOption: (
    option:
      | "grammar"
      | "shorter"
      | "longer"
      | "text"
      | "paragraph"
      | "rewrite"
      | null
  ) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AIOptions = forwardRef<HTMLDivElement, Props>(
  ({ setOption, open, setOpen }, ref) => {
    return (
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div ref={ref}></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setOpen(false);
              setOption("grammar");
            }}
          >
            <Check size={20} color="#19B2B9" weight="light" />
            <p className="ml-2">AI grammar check</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOption("text")}
          >
            <TextAa size={20} color="#19B2B9" weight="light" />
            <p className="ml-2">AI generate text</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOption("paragraph")}
          >
            <Paragraph size={20} color="#19B2B9" weight="light" />
            <p className="ml-2">AI generate paragraph</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOption("shorter")}
          >
            <SortAscending size={20} color="#19B2B9" weight="light" />
            <p className="ml-2">Make shorter</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOption("longer")}
          >
            <SortDescending size={20} color="#19B2B9" weight="light" />
            <p className="ml-2">Make longer</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOption("rewrite")}
          >
            <PencilCircle size={20} color="#19B2B9" weight="light" />
            <p className="ml-2">Rewrite</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
