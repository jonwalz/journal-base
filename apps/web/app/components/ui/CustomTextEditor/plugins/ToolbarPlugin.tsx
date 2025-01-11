import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

const LowPriority = 1;

function Divider() {
  return <div className="mx-2 h-4 w-px bg-gray-200 dark:bg-gray-700" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div
      className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700"
      ref={toolbarRef}
    >
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={`p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 ${
          !canUndo ? "cursor-not-allowed" : ""
        }`}
        aria-label="Undo"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M9 14l-4-4 4-4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 10h11a4 4 0 0 1 0 8h-1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 ${
          !canRedo ? "cursor-not-allowed" : ""
        }`}
        aria-label="Redo"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M15 14l4-4-4-4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 10H8a4 4 0 0 0 0 8h1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={`p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isBold ? "bg-gray-200 dark:bg-gray-600" : ""
        }`}
        aria-label="Format Bold"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
          <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isItalic ? "bg-gray-200 dark:bg-gray-600" : ""
        }`}
        aria-label="Format Italics"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="19"
            y1="4"
            x2="10"
            y2="4"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="20"
            x2="5"
            y2="20"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line x1="15" y1="4" x2="9" y2="20" strokeWidth="2" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={`p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isUnderline ? "bg-gray-200 dark:bg-gray-600" : ""
        }`}
        aria-label="Format Underline"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="4"
            y1="21"
            x2="20"
            y2="21"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={`p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isStrikethrough ? "bg-gray-200 dark:bg-gray-600" : ""
        }`}
        aria-label="Format Strikethrough"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 6C16 6 14.5 4 12 4C9.5 4 7 6 7 8C7 10 9 11 12 11"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 18C8 18 9.5 20 12 20C14.5 20 17 18 17 16C17 14 15 13 12 13"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Left Align"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="3"
            y1="12"
            x2="15"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="3"
            y1="18"
            x2="18"
            y2="18"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Center Align"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="12"
            x2="18"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="4"
            y1="18"
            x2="20"
            y2="18"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="p-2 mr-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Right Align"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="9"
            y1="12"
            x2="21"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="18"
            x2="21"
            y2="18"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Justify Align"
      >
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
