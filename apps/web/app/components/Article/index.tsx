import { Link } from "@remix-run/react";

export default function Article() {
  return (
    <article className="prose-p:text-text dark:prose-p:text-darkText mx-auto w-[700px] py-20 leading-relaxed prose-h2:mb-8 prose-headings:font-heading prose-h2:text-2xl prose-h3:mb-6 prose-h3:text-xl prose-p:leading-7 prose-p:font-base prose-code:p-[3px] prose-a:underline prose-a:font-heading prose-code:mx-1 prose-code:rounded-base prose-code:font-bold prose-code:border prose-code:text-text prose-code:text-sm prose-code:border-border dark:prose-code:border-darkBorder prose-code:bg-main prose-code:px-2 m1000:w-[500px] m750:w-4/5 m400:w-full m400:py-16 prose-h2:m400:text-xl prose-h3:m400:text-lg">
      Replace with landing page
      <p>
        <Link to="/dashboard" className="underline">
          Go to the dashboard
        </Link>
      </p>
    </article>
  );
}
