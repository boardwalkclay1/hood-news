export async function scrapeEvents(url, source) {
  const res = await fetch(url);
  const events = [];

  const rewriter = new HTMLRewriter()
    .on(".event, .community-event, .calendar-item", {
      element(el) {
        const title = el.querySelector("h2,h3")?.textContent || "";
        const date = el.querySelector(".date")?.textContent || "";
        const link = el.querySelector("a")?.getAttribute("href") || "";

        if (title && link) {
          events.push({
            city_id: source.city_id,
            zone_id: source.zone_id,
            title,
            description: "",
            event_date: date,
            address: "",
            event_url: absoluteURL(url, link)
          });
        }
      }
    });

  await rewriter.transform(res).text();

  return events;
}
