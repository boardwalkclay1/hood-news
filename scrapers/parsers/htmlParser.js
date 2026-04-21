import { fetchHTML } from "../../functions/fetchHTML.js";
import { extractText } from "../../functions/extractText.js";
import { hash } from "../../functions/hash.js";

export async function htmlParser(source) {
  const html = await fetchHTML(source.url);
  const articles = extractText(html);

  return articles.map(a => ({
    source_id: source.id,
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: a.title,
    body: a.body,
    url: a.url,
    published_at: a.published_at || null,
    hash: hash(a.title + a.url)
  }));
}
