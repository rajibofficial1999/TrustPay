import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { useState } from "react";
import { Toggle } from "../ui/toggle";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: false,
      key: "heading1",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: false,
      key: "heading2",
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: false,
      key: "heading3",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: false,
      key: "bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: false,
      key: "italic",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: false,
      key: "strike",
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: false,
      key: "left",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: false,
      key: "center",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: false,
      key: "right",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: false,
      key: "bulletList",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: false,
      key: "orderedList",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: false,
      key: "highlight",
    },
  ];

  const [filterOptions, setFilterOptions] = useState(Options);

  return (
    <div className="border rounded-md p-1 bg-slate-50 space-x-2 z-50 mb-2">
      {filterOptions.map((option) => (
        <Toggle
          className={cn(
            "cursor-pointer hover:bg-gray-300 hover:text-gray-700",
            {
              "!bg-gray-300 !text-gray-700": option.preesed,
            }
          )}
          key={option.key}
          pressed={option.preesed}
          onPressedChange={() => {
            setFilterOptions((prevStates) => {
              return prevStates.map((prevState) => {
                if (prevState.key === option.key) {
                  return { ...prevState, preesed: !prevState.preesed };
                }
                return prevState;
              });
            });

            option.onClick();
          }}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
