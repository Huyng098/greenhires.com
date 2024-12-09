import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip } from "@/components/ui/tooltip";
import Linter from "@/lib/tiptap-extension";

import { LinterRange, Mistake } from "@/interfaces/ai";
import { useResumeStore } from "@/stores/resume";
import {
  HighlighterCircle,
  LinkSimple,
  ListBullets,
  ListNumbers,
  MagicWand,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextAUnderline,
  TextB,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextUnderline,
} from "@phosphor-icons/react";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  EditorContentProps,
  useEditor,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import classNames from "classnames";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FontSize from "tiptap-extension-font-size";
import { AIText } from "./ai-text";
import "./custom-editor.css";
import FontFamilyTiptap from "./font-family";
import FontSizeTiptap from "./font-size";

interface RichInputProps
  extends Omit<
    EditorContentProps,
    "ref" | "editor" | "content" | "value" | "onChange" | "className"
  > {
  content?: string;
  topic?: string;
  onChange?: (value: string) => void;
  hideToolbar?: boolean;
  className?: string;
  editorClassName?: string;
  isHasAIOption?: boolean;
  placeholder?: string;
  focus?: boolean;
}

const Toolbar = React.memo(
  ({
    editor,
    hideToolbar = false,
  }: {
    editor: Editor;
    hideToolbar?: boolean;
  }) => {
    const setLink = useCallback(() => {
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }, [editor]);

    const textColorRef = useRef<HTMLInputElement>(null);

    const [currentColor, setCurrentColor] = useState<string>();

    return (
      <div
        className={classNames(
          "flex items-center flex-wrap",
          hideToolbar && "bg-white shadow-md rounded min-w-[300px]"
        )}
      >
        <Tooltip content="Bold">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <TextB size={18} />
          </Toggle>
        </Tooltip>

        <Tooltip content="Italic">
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <TextItalic size={18} />
          </Toggle>
        </Tooltip>

        <Tooltip content="Underline">
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
          >
            <TextUnderline size={18} />
          </Toggle>
        </Tooltip>

        <Tooltip content="Highlight">
          <Toggle
            size="sm"
            pressed={editor.isActive("highlight")}
            disabled={!editor.can().chain().focus().toggleHighlight().run()}
            onPressedChange={() =>
              editor.chain().focus().toggleHighlight().run()
            }
          >
            <HighlighterCircle size={18} />
          </Toggle>
        </Tooltip>
        <FontFamilyTiptap
          onChangeFontFamily={(font) =>
            editor.chain().focus().setFontFamily(font.name).run()
          }
        />

        <FontSizeTiptap
          onChangeFontSize={(size) =>
            editor.chain().focus().setFontSize(`${size}pt`).run()
          }
        />

        <Tooltip content="Text Color">
          <label htmlFor="color-input">
            <Toggle
              value="justify"
              onClick={() => textColorRef.current?.click()}
              size="sm"
            >
              <div className="flex flex-col items-center">
                <TextAUnderline size={18} />
                <input
                  type="color"
                  id="color-input"
                  className="input-color opacity-0 mt-[-8px]"
                  onInput={(event) => {
                    setCurrentColor(event.currentTarget.value);
                    editor
                      .chain()
                      .focus()
                      .setColor(event.currentTarget.value)
                      .run();
                  }}
                  ref={textColorRef}
                  value={editor.getAttributes("textStyle").color}
                />
                <div
                  style={{
                    backgroundColor:
                      currentColor || editor.getAttributes("textStyle").color,
                  }}
                  className="mt-[-6px] w-full h-[3px]"
                ></div>
              </div>
            </Toggle>
          </label>
        </Tooltip>

        {!hideToolbar && (
          <>
            <Tooltip content="Hyperlink">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="px-2"
                onClick={setLink}
              >
                <LinkSimple size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Heading 1">
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                disabled={
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .toggleHeading({ level: 1 })
                    .run()
                }
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                <TextHOne size={18} />
              </Toggle>
            </Tooltip>

            <Tooltip content="Heading 2">
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                disabled={
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .toggleHeading({ level: 2 })
                    .run()
                }
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <TextHTwo size={18} />
              </Toggle>
            </Tooltip>

            <Tooltip content="Heading 3">
              <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                disabled={
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .toggleHeading({ level: 3 })
                    .run()
                }
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                <TextHThree size={18} />
              </Toggle>
            </Tooltip>
            <Tooltip content="Align Left">
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "left" })}
                disabled={
                  !editor.can().chain().focus().setTextAlign("left").run()
                }
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              >
                <TextAlignLeft size={18} />
              </Toggle>
            </Tooltip>

            <Tooltip content="Align Center">
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "center" })}
                disabled={
                  !editor.can().chain().focus().setTextAlign("center").run()
                }
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <TextAlignCenter size={18} />
              </Toggle>
            </Tooltip>

            <Tooltip content="Align Right">
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "right" })}
                disabled={
                  !editor.can().chain().focus().setTextAlign("right").run()
                }
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <TextAlignRight size={18} />
              </Toggle>
            </Tooltip>

            <Tooltip content="Align Justify">
              <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: "justify" })}
                disabled={
                  !editor.can().chain().focus().setTextAlign("justify").run()
                }
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
              >
                <TextAlignJustify size={18} />
              </Toggle>
            </Tooltip>
            <Tooltip content="Bullet List">
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
              >
                <ListBullets size={18} />
              </Toggle>
            </Tooltip>

            <Tooltip content="Numbered List">
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
              >
                <ListNumbers size={18} />
              </Toggle>
            </Tooltip>
          </>
        )}
      </div>
    );
  }
);

export const RichInput = forwardRef<Editor, RichInputProps>(
  ({
    content,
    topic,
    onChange,
    hideToolbar = false,
    className,
    editorClassName,
    isHasAIOption = true,
    placeholder,
    focus,
    ...props
  }) => {
    const [aiOpen, setAIOpen] = useState(false);
    const [option, setOption] = useState<
      "grammar" | "shorter" | "longer" | "text" | "paragraph" | "rewrite" | null
    >(null);
    const job_title = useResumeStore()((state) => state.resume.title);
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Highlight,
        TextStyle,
        FontSize,
        Color,
        Placeholder.configure({ placeholder }),
        Link.configure({ openOnClick: true }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Heading.configure({
          levels: [1, 2, 3],
        }),
        FontFamily,
        Linter,
      ],
      autofocus: focus && "end",
      editorProps: {
        attributes: {
          class: classNames(
            "prose max-h-[200px] max-w-none overflow-y-auto dark:prose-invert focus:outline-none [&_*]:my-2",
            editorClassName
          ),
        },
      },
      content,
      parseOptions: { preserveWhitespace: "full" },
      onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
      immediatelyRender: false,
    });

    const selectedText = useMemo(() => {
      if (!editor) return "";
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);
      return selectedText || editor.getText();
    }, [editor?.state.selection]);
    const onChangeAIText = (value: string, isMinus: boolean) => {
      if (!editor) return;
      if (!isMinus) {
        editor.commands.insertContent(value);
      } else {
        const html = editor.getHTML();
        editor.commands.setContent(html.replace(value, ""));
      }
    };
    const onChangeContent = useCallback(
      (value: string) => {
        if (!editor) return;
        if (!editor.state.selection.empty) {
          const { from, to } = editor.state.selection;
          editor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .insertContent(value)
            .run();
        } else {
          editor
            .chain()
            .focus()
            .deleteRange({ from: 0, to: editor.state.doc.content.size })
            .insertContent(value)
            .run();
        }
      },
      [editor, selectedText]
    );
    const highlightGrammarErrors = (mistakes: Mistake[]) => {
      if (!editor) return;
      const content = editor.getText();
      let initialIndex = 0;
      const ranges: LinterRange[] = [];
      mistakes.forEach((mistake) => {
        const from = content.indexOf(mistake.original, initialIndex);
        const to = from + mistake.original.length;
        ranges.push({ from: from + 1, to: to + 1 });
        initialIndex = to;
      });
      editor.commands.addLinter(ranges);
    };
    useEffect(() => {
      if (!editor || !hideToolbar) return;

      const htmlPattern = /<[^>]*>/;
      const isPlainText = !htmlPattern.test(content || "");

      if (isPlainText) {
        editor.commands.setContent(content || "");
      } else {
        editor
          .chain()
          .focus()
          .setContent(content || "", false, {
            preserveWhitespace: "full",
          });
      }
    }, [content, editor, hideToolbar]);

    if (!editor) {
      return (
        <div className="space-y-2">
          <div
            className={classNames(
              "animate-pulse rounded-md bg-secondary h-[42px] w-full",
              hideToolbar && "hidden"
            )}
          />
          <div className="animate-pulse rounded-md bg-secondary h-[90px] w-full" />
        </div>
      );
    }
    return (
      <div
        className={`bg-white rounded-md border w-full relative ${isHasAIOption ? "mt-7" : ""}`}
      >
        {!hideToolbar && <Toolbar editor={editor} />}
        {hideToolbar && editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <Toolbar editor={editor} hideToolbar={hideToolbar} />
          </BubbleMenu>
        )}
        <EditorContent
          editor={editor}
          className={classNames("px-3 w-full", className)}
          {...props}
        />
        {isHasAIOption && (
          <AIText
            job_title={job_title}
            initialText={selectedText}
            onChangeText={onChangeAIText}
            aiOpen={aiOpen}
            className="absolute top-[-25px] right-0"
            setAIOpen={setAIOpen}
            onChange={onChangeContent}
            topic={topic}
            option={option}
            setOption={setOption}
            highlightGrammarErrors={highlightGrammarErrors}
          >
            <button
              disabled={option !== null}
              onClick={() => setAIOpen(true)}
              className="flex gap-2 font-medium text-secondary-main hover:text-secondary-main/50 rounded-lg px-2"
            >
              <MagicWand size={20} weight="fill" />
              <p>AI Assistant</p>
            </button>
          </AIText>
        )}
      </div>
    );
  }
);
