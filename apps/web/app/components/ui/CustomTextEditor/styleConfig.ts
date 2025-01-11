const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;

export const parseAllowedFontSize = (input: string): string => {
  const match = input.match(/^(\d+(?:\.\d+)?)px$/);
  if (match) {
    const n = Number(match[1]);
    if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
      return input;
    }
  }
  return "";
};

export function parseAllowedColor(input: string) {
  return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : "";
}

// Add Tailwind classes for text formatting
export const formatClasses = {
  bold: "font-bold",
  italic: "italic",
  underline: "underline",
  strikethrough: "line-through",
  code: "bg-gray-100 dark:bg-gray-700 px-1 py-0.5 font-mono text-[94%]",
  link: "text-blue-600 dark:text-blue-400 no-underline",
} as const;

export const headingClasses = {
  h1: "text-2xl text-gray-900 dark:text-white font-normal mb-3",
  h2: "text-base text-gray-600 dark:text-gray-300 font-bold mt-2.5 uppercase",
} as const;

export const listClasses = {
  ol: "pl-4 m-0",
  ul: "pl-4 m-0",
  li: "my-2 mx-8",
  nestedLi: "list-none",
} as const;

export const quoteClasses =
  "ml-5 text-gray-600 dark:text-gray-300 border-l-4 border-gray-300 dark:border-gray-600 pl-4" as const;
