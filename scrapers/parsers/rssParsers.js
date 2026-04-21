import { fetchRSS } from "../../functions/fetchRSS.js";
import { cleanHTML } from "../../functions/cleanHTML.js";
import { hash } from "../../functions/hash.js";

export async function rssParser(source) {
  const feed = await fetchRSS(source.url);

  return feed.items.map(item => ({
    source_id: source.id,
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: item.title,
    body: cleanHTML(item.contentSnippet || item.content || ""),
    url: item.link,
    published_at: item.isoDate || null,
    hash: hash(item.title + item.link)
  }));
}
