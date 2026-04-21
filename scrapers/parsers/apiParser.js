import { fetchJSON } from "../../functions/fetchJSON.js";
import { hash } from "../../functions/hash.js";

export async function apiParser(source) {
  const data = await fetchJSON(source.url);

  return data.items.map(item => ({
    source_id: source.id,
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: item.title,
    body: item.summary || "",
    url: item.url,
    published_at: item.published_at || null,
    hash: hash(item.title + item.url)
  }));
}
