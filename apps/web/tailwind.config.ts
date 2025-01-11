import type { Config } from "tailwindcss";

// Define custom theme type
type CustomThemeType = {
  colors: {
    main: {
      DEFAULT: string;
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    overlay: string;
    bg: string;
    background: string;
    foreground: string;
    text: string;
    border: string;
    darkBg: string;
    darkText: string;
    darkBorder: string;
    secondaryBlack: string;
  };
  borderRadius: {
    base: string;
  };
  boxShadow: {
    light: string;
    dark: string;
  };
  translate: {
    boxShadowX: string;
    boxShadowY: string;
    reverseBoxShadowX: string;
    reverseBoxShadowY: string;
  };
  fontWeight: {
    base: string;
    heading: string;
  };
  typography: (props: { theme: (path: string) => string }) => {
    pink: {
      css: Record<string, string>;
    };
  };
};

const config = {
  darkMode: ["selector"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: "#b3cb9a",
          50: "#b3cb9a",
          100: "#a3bf87",
          200: "#93b374",
          300: "#83a761",
          400: "#739b4e",
          500: "#638f3b",
          600: "#538328",
          700: "#437715",
          800: "#336b02",
          900: "#235f00",
        },
        overlay: "rgba(0,0,0,0.8)",
        bg: "#dfe5f2",
        background: "#ecefd6",
        foreground: "#fff",
        text: "#000",
        border: "#000",
        darkBg: "#1C1C1C",
        darkText: "#eeefe9",
        darkBorder: "#000",
        secondaryBlack: "#232323",
      },
      borderRadius: {
        base: "5px",
      },
      boxShadow: {
        light: "4px 4px 0px 0px #000",
        dark: "4px 4px 0px 0px #000",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
        reverseBoxShadowX: "-4px",
        reverseBoxShadowY: "-4px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
      typography: ({ theme }) => ({
        pink: {
          css: {
            "--tw-prose-body": theme("colors.pink[800]"),
            "--tw-prose-headings": theme("colors.pink[900]"),
            "--tw-prose-lead": theme("colors.pink[700]"),
            "--tw-prose-links": theme("colors.pink[900]"),
            "--tw-prose-bold": theme("colors.pink[900]"),
            "--tw-prose-counters": theme("colors.pink[600]"),
            "--tw-prose-bullets": theme("colors.pink[400]"),
            "--tw-prose-hr": theme("colors.pink[300]"),
            "--tw-prose-quotes": theme("colors.pink[900]"),
            "--tw-prose-quote-borders": theme("colors.pink[300]"),
            "--tw-prose-captions": theme("colors.pink[700]"),
            "--tw-prose-code": theme("colors.pink[900]"),
            "--tw-prose-pre-code": theme("colors.pink[100]"),
            "--tw-prose-pre-bg": theme("colors.pink[900]"),
            "--tw-prose-th-borders": theme("colors.pink[300]"),
            "--tw-prose-td-borders": theme("colors.pink[200]"),
            "--tw-prose-invert-body": theme("colors.pink[200]"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-lead": theme("colors.pink[300]"),
            "--tw-prose-invert-links": theme("colors.white"),
            "--tw-prose-invert-bold": theme("colors.white"),
            "--tw-prose-invert-counters": theme("colors.pink[400]"),
            "--tw-prose-invert-bullets": theme("colors.pink[600]"),
            "--tw-prose-invert-hr": theme("colors.pink[700]"),
            "--tw-prose-invert-quotes": theme("colors.pink[100]"),
            "--tw-prose-invert-quote-borders": theme("colors.pink[700]"),
            "--tw-prose-invert-captions": theme("colors.pink[400]"),
            "--tw-prose-invert-code": theme("colors.white"),
            "--tw-prose-invert-pre-code": theme("colors.pink[300]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.pink[600]"),
            "--tw-prose-invert-td-borders": theme("colors.pink[700]"),
          },
        },
      }),
    },
  },
} satisfies Config & { theme: { extend: CustomThemeType } };

export default config;
