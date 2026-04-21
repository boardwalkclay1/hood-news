import { fetchHTML } from "../../functions/fetchHTML.js";
import { extractText } from "../../functions/extractText.js";

export async function eventsParser(source) {
  const html = await fetchHTML(source.url);
  const events = extractText(html, "events");

  return events.map(ev => ({
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: ev.title,
    description: ev.description,
    event_date: ev.date,
    address: ev.address,
    event_url: ev.url
  }));
}
