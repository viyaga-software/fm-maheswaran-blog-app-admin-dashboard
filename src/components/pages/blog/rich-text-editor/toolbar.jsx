"use client";

import React from "react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading1,
  Heading3,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Highlighter as HighlightIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Check,
  VideoIcon,
  PencilLine,
  Palette,
} from "lucide-react";

// Helper function to convert YouTube URL to embed format
const convertToEmbedUrl = (url) => {
  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([a-zA-Z0-9_-]{11})/);
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId[1]}`;
  }
  return '';
};

const isYouTubeURL = (url) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/.+/;
  return pattern.test(url);
};

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      label: "Underline",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      label: "Strikethrough",
    },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      label: "Heading 1",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      label: "Heading 3",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      label: "Ordered List",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      label: "Blockquote",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
      label: "Code Block",
    },
    {
      icon: ImageIcon,
      action: () => {
        const url = prompt("Enter image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
      },
      isActive: false,
      label: "Insert Image",
    },
    {
      icon: LinkIcon,
      action: () => {
        const url = prompt("Enter link URL");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      isActive: editor.isActive("link"),
      label: "Insert Link",
    },
    {
      icon: HighlightIcon,
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive("highlight"),
      label: "Highlight",
    },
    {
      icon: TableIcon,
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
      isActive: false,
      label: "Insert Table",
    },
    {
      icon: VideoIcon,
      action: () => {
        const url = prompt("Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...):");
        if (url && isYouTubeURL(url)) {
          const embedUrl = convertToEmbedUrl(url);
          const iframe = `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
          editor.chain().focus().insertContent(iframe).run();
        } else {
          alert("Please enter a valid YouTube URL.");
        }
      },
      isActive: false,
      label: "Insert Video",
    },
    {
      icon: PencilLine,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      label: "Horizontal Rule",
    },
    {
      icon: Palette,
      action: () => {
        const color = prompt("Enter text color");
        if (color) editor.chain().focus().setColor(color).run();
      },
      isActive: false,
      label: "Text Color",
    },
    {
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      label: "Align Left",
    },
    {
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      label: "Align Center",
    },
    {
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      label: "Align Right",
    },
    {
      icon: AlignJustify,
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      label: "Align Justify",
    },
    {
      icon: Check,
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive("taskList"),
      label: "Task List",
    },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      label: "Undo",
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      label: "Redo",
    },
  ];

  return (
    <div className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start gap-5 w-full flex-wrap border border-gray-700">
      <div className="flex justify-start items-center gap-5 w-full flex-wrap">
        {buttons.map(({ icon: Icon, action, isActive, label }, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              action();
            }}
            className={
              isActive
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
            }
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
