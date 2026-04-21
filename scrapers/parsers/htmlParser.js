async function scrapeHTML(url, city_id, zone_id, source_id) {
  const res = await fetch(url);

  const articles = [];

  const rewriter = new HTMLRewriter()
    .on("article", {
      element(el) {
        const title = el.querySelector("h1,h2,h3")?.textContent || "";
        const link = el.querySelector("a")?.getAttribute("href") || "";
        const body = el.textContent.trim().slice(0, 500);

        if (title && link) {
          articles.push({
            source_id,
            city_id,
            zone_id,
            title,
            body,
            url: absoluteURL(url, link),
            published_at: null,
            hash: hash(title + link)
          });
        }
      }
    });

  await rewriter.transform(res).text();

  return articles;
}
