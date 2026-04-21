export async function scrapeAPI(url, source) {
  const json = await (await fetch(url)).json();

  return json.items.map(item => ({
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
