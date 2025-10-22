import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const formatButtons = [
    { icon: Bold, command: "bold", label: "Bold", testId: "button-bold" },
    { icon: Italic, command: "italic", label: "Italic", testId: "button-italic" },
    { icon: Heading1, command: "formatBlock", value: "h2", label: "Heading 1", testId: "button-h1" },
    { icon: Heading2, command: "formatBlock", value: "h3", label: "Heading 2", testId: "button-h2" },
    { icon: List, command: "insertUnorderedList", label: "Bullet List", testId: "button-ul" },
    { icon: ListOrdered, command: "insertOrderedList", label: "Numbered List", testId: "button-ol" },
    { icon: Quote, command: "formatBlock", value: "blockquote", label: "Quote", testId: "button-quote" },
    { icon: Undo, command: "undo", label: "Undo", testId: "button-undo" },
    { icon: Redo, command: "redo", label: "Redo", testId: "button-redo" },
  ];

  return (
    <Card className={`overflow-hidden ${isFocused ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {formatButtons.map((btn, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover-elevate"
            onClick={() => executeCommand(btn.command, btn.value)}
            title={btn.label}
            data-testid={btn.testId}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        data-testid="editor-content"
        style={{
          maxHeight: "600px",
          overflowY: "auto",
        }}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          position: absolute;
        }
        [contenteditable] {
          outline: none;
        }
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        [contenteditable] p {
          margin-bottom: 1rem;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        [contenteditable] blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        [contenteditable] strong {
          font-weight: 700;
        }
        [contenteditable] em {
          font-style: italic;
        }
      `}</style>
    </Card>
  );
}
