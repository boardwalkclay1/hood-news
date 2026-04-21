async function scrapeAPI(url, city_id, zone_id, source_id) {
  const json = await (await fetch(url)).json();

  return json.items.map(item => ({
    source_id,
    city_id,
    zone_id,
    title: item.title,
    body: item.summary || "",
    url: item.url,
    published_at: item.published_at || null,
    hash: hash(item.title + item.url)
  }));
}
