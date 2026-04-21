import { fetchJSON } from "../../functions/fetchJSON.js";
import { hash } from "../../functions/hash.js";

export async function youtubeParser(source) {
  const feed = await fetchJSON(source.url);

  return feed.items.map(video => ({
    source_id: source.id,
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: video.title,
    body: video.description,
    url: `https://youtube.com/watch?v=${video.id}`,
    published_at: video.publishedAt,
    hash: hash(video.title + video.id)
  }));
}
