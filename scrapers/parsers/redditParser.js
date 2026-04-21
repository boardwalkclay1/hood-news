import { fetchJSON } from "../../functions/fetchJSON.js";
import { hash } from "../../functions/hash.js";

export async function redditParser(source) {
  const json = await fetchJSON(source.url);

  return json.data.children.map(post => ({
    source_id: source.id,
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: post.data.title,
    body: post.data.selftext || "",
    url: `https://reddit.com${post.data.permalink}`,
    published_at: new Date(post.data.created_utc * 1000).toISOString(),
    hash: hash(post.data.title + post.data.permalink)
  }));
}
