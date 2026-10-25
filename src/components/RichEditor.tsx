"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

type Props = {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
};

export default function RichEditor({ content, onChange, editable = true }: Props) {
  const editor = useEditor({
    extensions: [
      // StarterKit includes: heading, bold, italic, bulletList, orderedList, listItem, etc.
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
      }),
      Underline,
    ],
    content,
    editable,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "docs-editor focus:outline-none min-h-[60vh] px-2 py-1",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const ToolbarBtn = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <style>{`
        .docs-editor, .docs-editor .tiptap {
          color: #111827 !important;
          font-size: 1rem;
          line-height: 1.75;
        }
        .docs-editor .tiptap:focus { outline: none; }
        .docs-editor .tiptap p { margin: 0.4em 0; color: #111827 !important; }
        .docs-editor .tiptap h1 { font-size: 2em !important; font-weight: 700 !important; color: #111827 !important; margin: 0.75em 0 0.25em; line-height: 1.2; }
        .docs-editor .tiptap h2 { font-size: 1.5em !important; font-weight: 600 !important; color: #111827 !important; margin: 0.75em 0 0.25em; line-height: 1.3; }
        .docs-editor .tiptap h3 { font-size: 1.25em !important; font-weight: 600 !important; color: #111827 !important; margin: 0.75em 0 0.25em; line-height: 1.4; }
        .docs-editor .tiptap strong { font-weight: 700 !important; }
        .docs-editor .tiptap em { font-style: italic !important; }
        .docs-editor .tiptap u { text-decoration: underline !important; }
        .docs-editor .tiptap ul { list-style-type: disc !important; padding-left: 1.5em !important; margin: 0.5em 0; }
        .docs-editor .tiptap ol { list-style-type: decimal !important; padding-left: 1.5em !important; margin: 0.5em 0; }
        .docs-editor .tiptap li { display: list-item !important; margin: 0.2em 0; color: #111827 !important; }
        .docs-editor .tiptap li > p { margin: 0; }
      `}</style>
      {editable && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 flex-wrap">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (⌘B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (⌘I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (⌘U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <List className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarBtn>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
