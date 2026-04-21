export async function scrapeResources(url, source) {
  const res = await fetch(url);
  const items = [];

  const rewriter = new HTMLRewriter()
    .on(".resource, .help-item, .assistance", {
      element(el) {
        const title = el.querySelector("h2,h3")?.textContent || "";
        const category = el.querySelector(".category")?.textContent || "";
        const link = el.querySelector("a")?.getAttribute("href") || "";

        if (title && link) {
          items.push({
            city_id: source.city_id,
            zone_id: source.zone_id,
            title,
            category,
            description: "",
            address: "",
            apply_url: absoluteURL(url, link)
          });
        }
      }
    });

  await rewriter.transform(res).text();

  return items;
}
