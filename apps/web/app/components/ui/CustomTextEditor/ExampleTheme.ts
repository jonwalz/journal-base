import {
  formatClasses,
  headingClasses,
  listClasses,
  quoteClasses,
} from "./styleConfig";

export default {
  code: formatClasses.code,
  heading: {
    h1: headingClasses.h1,
    h2: headingClasses.h2,
  },
  image: "",
  link: formatClasses.link,
  list: {
    listitem: listClasses.li,
    nested: {
      listitem: listClasses.nestedLi,
    },
    ol: listClasses.ol,
    ul: listClasses.ul,
  },
  ltr: "ltr",
  paragraph: "text-base text-gray-900 dark:text-white",
  placeholder: "text-gray-400 dark:text-gray-500",
  quote: quoteClasses,
  rtl: "rtl",
  text: {
    bold: formatClasses.bold,
    code: formatClasses.code,
    hashtag: "text-blue-500 dark:text-blue-400",
    italic: formatClasses.italic,
    overflowed: "opacity-50",
    strikethrough: formatClasses.strikethrough,
    underline: formatClasses.underline,
    underlineStrikethrough: `${formatClasses.underline} ${formatClasses.strikethrough}`,
  },
};
