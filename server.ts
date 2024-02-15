import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts";
import rehypeDocument from "https://esm.sh/rehype-document@7.0.3";
import rehypeFormat from "https://esm.sh/rehype-format@5.0.0";
import rehypeStringify from "https://esm.sh/rehype-stringify@10.0.0";
import remarkParse from "https://esm.sh/remark-parse@11.0.0";
import remarkRehype from "https://esm.sh/remark-rehype@11.1.0";
import { unified } from "https://esm.sh/unified@11.0.4";

Deno.serve({ port: 4507 }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname.match(/^\/\d+-/) && url.pathname.endsWith("/")) {
    const filename = `.${url.pathname}/README.md`;

    const input = await Deno.readTextFile(filename);

    const html = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeDocument, { title: url.pathname })
      .use(rehypeFormat)
      .use(rehypeStringify)
      .process(input);

    return new Response(html.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return serveDir(req, {
    showDirListing: true,
  });
});
