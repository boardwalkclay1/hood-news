import { fetchHTML } from "../../functions/fetchHTML.js";
import { extractText } from "../../functions/extractText.js";

export async function resourcesParser(source) {
  const html = await fetchHTML(source.url);
  const items = extractText(html, "resources");

  return items.map(r => ({
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: r.title,
    category: r.category,
    description: r.description,
    address: r.address,
    apply_url: r.apply_url
  }));
}
