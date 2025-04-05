import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  EditorState,
  ParagraphNode,
  TextNode,
} from "lexical";
import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { AutoLinkNode } from "@lexical/link";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

// This plugin handles setting the editor's content based on the initialContent prop.
function InitialContentPlugin({ initialContent }: { initialContent: string }) {
  // Get the editor instance from the context.
  const [editor] = useLexicalComposerContext();

  // Use useEffect to update the editor state when initialContent changes.
  useEffect(() => {
    // Read the current editor state to get the current text
    const currentText = editor
      .getEditorState()
      .read(() => $getRoot().getTextContent());

    // ONLY update the editor if the initialContent prop differs from the current text.
    // This prevents resetting the editor due to its own onChange -> setState -> prop update loop.
    if (initialContent !== currentText) {
      editor.update(() => {
        const root = $getRoot();
        // Clear existing content
        root.clear();
        // Create a new paragraph and set its text content.
        // If initialContent is empty, it creates an empty paragraph.
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(initialContent || "");
        paragraphNode.append(textNode);
        root.append(paragraphNode);
      });
    }
  }, [editor, initialContent]); // Dependencies: run when editor instance or initialContent prop changes.

  return null; // This plugin component doesn't render any visible UI
}

export default function Editor({
  onChange,
  initialContent,
}: {
  onChange: (content: string) => void;
  initialContent: string;
}): JSX.Element {
  // Callback for handling editor changes and notifying the parent component.
  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        // Simplistic text extraction; might need refinement for complex content
        const root = $getRoot();
        const text = root.getTextContent();
        console.log("Extracted text:", text); // Log the extracted text
        onChange(text);
      });
    },
    [onChange]
  );

  // Initial configuration for the Lexical editor.
  const initialConfig = {
    namespace: "ControlledEditor",
    onError: (error: Error) => {
      console.error(error); // Log errors
    },
    nodes: [
      // Re-enabled all nodes
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
      CodeNode,
      AutoLinkNode,
      ParagraphNode,
      TextNode,
    ],
    theme: ExampleTheme, // Apply custom theme
    editorState: null, // Set initial state to null; the InitialContentPlugin will populate it.
  };

  // Main component structure using LexicalComposer and plugins.
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative bg-white dark:bg-secondaryBlack rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ToolbarPlugin /> {/* Renders the toolbar */}
        <div className="relative min-h-[150px] bg-white dark:bg-secondaryBlack">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[150px] resize-none text-[15px] relative tab-[1] outline-none p-[15px_10px] caret-gray-600 dark:caret-white" />
            }
            ErrorBoundary={LexicalErrorBoundary} // Error boundary for Lexical components
          />
          <HistoryPlugin /> {/* Enables undo/redo functionality */}
          <OnChangePlugin onChange={handleEditorChange} />{" "}
          {/* Listens for content changes */}
          {/* --- Use the new plugin --- */}
          <InitialContentPlugin initialContent={initialContent} />{" "}
          {/* Manages initial/updated content */}
          {/* --- End use the new plugin --- */}
        </div>
      </div>
    </LexicalComposer>
  );
}
