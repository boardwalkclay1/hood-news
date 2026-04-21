async function scrapeRSS(url, city_id, zone_id, source_id) {
  const res = await fetch(url);
  const xml = await res.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items.map(item => {
    const title = extractTag(item[1], "title");
    const link = extractTag(item[1], "link");
    const description = extractTag(item[1], "description");
    const pubDate = extractTag(item[1], "pubDate");

    return {
      source_id,
      city_id,
      zone_id,
      title,
      body: stripHTML(description),
      url: link,
      published_at: pubDate,
      hash: hash(title + link)
    };
  });
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : "";
}
