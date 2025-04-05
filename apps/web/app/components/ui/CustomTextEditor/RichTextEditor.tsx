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
  $isElementNode,
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
import { useCallback, useEffect, useRef } from "react";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";

const placeholder = "Enter your thoughts...";

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

export function Editor({
  onChange,
  initialContent,
}: {
  onChange?: (content: string) => void;
  initialContent?: string;
}) {
  const editorRef = useRef<LexicalEditor | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && initialContent === "") {
      let isAlreadyEmpty = false;
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const firstChild = root.getFirstChild();
        // Check if root is empty OR contains only one child that is an ElementNode and is empty
        isAlreadyEmpty =
          root.isEmpty() ||
          (root.getChildrenSize() === 1 &&
            $isElementNode(firstChild) &&
            firstChild.isEmpty());
      });

      if (!isAlreadyEmpty) {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          root.append($createParagraphNode());
        });
      }
    }
  }, [initialContent]);

  const handleOnChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      if (!editorRef.current) {
        editorRef.current = editor;
      }
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        onChange?.(textContent);
      });
    },
    [onChange]
  );

  const editorConfig = {
    html: {
      export: exportMap,
      import: constructImportMap(),
    },
    namespace: "React.js Demo",
    nodes: [ParagraphNode, TextNode],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
    editorState: initialContent
      ? () => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          const text = $createTextNode(initialContent);
          paragraph.append(text);
          root.append(paragraph);
        }
      : undefined,
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative bg-white dark:bg-secondaryBlack rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ToolbarPlugin />
        <div className="relative min-h-[150px] bg-white dark:bg-secondaryBlack">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none p-4" />}
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={handleOnChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
