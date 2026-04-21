export async function scrapeRSS(url, source) {
  const res = await fetch(url);
  const xml = await res.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items.map(item => {
    const block = item[1];

    const title = extract(block, "title");
    const link = extract(block, "link");
    const description = extract(block, "description");
    const pubDate = extract(block, "pubDate");

    return {
      source_id: source.id,
      city_id: source.city_id,
      zone_id: source.zone_id,
      title,
      body: stripHTML(description),
      url: link,
      published_at: pubDate,
      hash: hash(title + link)
    };
  });
}

function extract(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : "";
}
