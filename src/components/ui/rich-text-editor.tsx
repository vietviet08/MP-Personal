"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorRef = any;

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    height?: number;
    disabled?: boolean;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Write your content here...",
    height = 400,
    disabled = false,
}: RichTextEditorProps) {
    const editorRef = useRef<EditorRef>(null);

    const handleEditorChange = (content: string) => {
        onChange(content);
    };

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={value}
                onEditorChange={handleEditorChange}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                    content_style:
                        "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; }",
                    placeholder: placeholder,
                    branding: false,
                    statusbar: false,
                    resize: false,
                    skin: "oxide",
                    content_css: "default",
                    setup: (editor: EditorRef) => {
                        editor.on("init", () => {
                            editor.getContainer().style.border = "none";
                        });
                    },
                }}
                disabled={disabled}
            />
        </div>
    );
}
