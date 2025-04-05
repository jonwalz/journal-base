import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $getRoot,
  $isTextNode,
  $createParagraphNode,
  $createTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";

const placeholder = "Enter your thoughts...";

// Plugin to handle initial content loading and updates
function UpdatePlugin({
  initialContent,
  onChange,
}: {
  initialContent?: string;
  onChange?: (content: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const initialContentRef = useRef(initialContent);
  const isFirstRender = useRef(true);
  const [isClient, setIsClient] = useState(false);

  // Combined effect for setting client state and handling content updates
  useEffect(() => {
    // This runs both on initial mount and when dependencies change
    if (!isClient) {
      setIsClient(true); // Set client flag on first run in browser
      return; // Exit early, content logic will run on next render cycle when isClient is true
    }

    // Guard against running if editor isn't ready or no content defined
    if (!editor || initialContent === undefined) {
      return;
    }

    // --- Initial Content Load Logic --- (Runs only once when isClient becomes true)
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark initial load as done
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (initialContent === "") {
          root.append($createParagraphNode());
        } else {
          const paragraph = $createParagraphNode();
          const text = $createTextNode(initialContent);
          paragraph.append(text);
          root.append(paragraph);
        }
      });
    }
    // --- Subsequent Content Update Logic --- (Runs if content prop changes after initial load)
    else if (initialContent !== initialContentRef.current) { // Compare with ref to detect actual prop change
      initialContentRef.current = initialContent; // Update ref
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (initialContent === "") {
          root.append($createParagraphNode());
        } else {
          const paragraph = $createParagraphNode();
          const text = $createTextNode(initialContent);
          paragraph.append(text);
          root.append(paragraph);
        }
      });
    }
    // If isClient is true, but it's not the first render AND content hasn't changed, do nothing.

  }, [editor, initialContent, isClient]); // Depend on editor, content, and client status

  // The OnChangePlugin requires a callback with the specific Lexical signature.
  // We create an inner callback that extracts the text and calls the simplified `onChange` prop.
  const handleLexicalOnChange = useCallback(
    (editorState: EditorState /*, _editor: LexicalEditor, _tags: Set<string> */) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        if (onChange) {
          onChange(textContent); // Call the passed string-based onChange prop (check if defined)
        }
      });
    },
    [onChange] // Depend on the passed onChange prop
  );

  return <OnChangePlugin onChange={handleLexicalOnChange} />;
}

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

interface EditorProps {
  onChange: (content: string) => void;
  initialContent?: string; // Make initialContent optional
}

export function Editor({ onChange, initialContent }: EditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    html: {
      export: exportMap,
      import: constructImportMap(),
    },
    nodes: [ParagraphNode, TextNode],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
  };

  const handleOnChange = useCallback(
    (content: string) => {
      onChange?.(content);
    },
    [onChange]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative bg-white dark:bg-secondaryBlack rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ToolbarPlugin />
        <div className="relative min-h-[150px] bg-white dark:bg-secondaryBlack">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input outline-none min-h-[150px] resize-none p-4 caret-neutral-900" />}
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <UpdatePlugin onChange={handleOnChange} initialContent={initialContent} /> {/* Pass the handleOnChange wrapper */}
          <AutoFocusPlugin />
          {/* The UpdatePlugin internally uses OnChangePlugin, no need for a duplicate here */}
        </div>
      </div>
    </LexicalComposer>
  );
}
