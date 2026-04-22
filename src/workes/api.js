import {
  getCities,
  getCity,
  getZones,
  getEditions,
  getArticles,
  getJobs,
  getEvents,
  getResources
} from "../db/queries.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const db = env.DB;

    try {
      if (path === "/api/cities") {
        return json(await getCities(db));
      }

      if (path.startsWith("/api/cities/")) {
        const id = path.split("/").pop();
        return json(await getCity(db, id));
      }

      if (path === "/api/zones") {
        const cityId = url.searchParams.get("city_id");
        return json(await getZones(db, cityId));
      }

      if (path === "/api/editions") {
        const cityId = url.searchParams.get("city_id");
        const zoneId = url.searchParams.get("zone_id");
        return json(await getEditions(db, cityId, zoneId));
      }

      if (path === "/api/articles") {
        const cityId = url.searchParams.get("city_id");
        const limit = parseInt(url.searchParams.get("limit") || "50", 10);
        return json(await getArticles(db, cityId, limit));
      }

      if (path === "/api/jobs") {
        const cityId = url.searchParams.get("city_id");
        const zoneId = url.searchParams.get("zone_id");
        return json(await getJobs(db, cityId, zoneId));
      }

      if (path === "/api/events") {
        const cityId = url.searchParams.get("city_id");
        const zoneId = url.searchParams.get("zone_id");
        return json(await getEvents(db, cityId, zoneId));
      }

      if (path === "/api/resources") {
        const cityId = url.searchParams.get("city_id");
        const zoneId = url.searchParams.get("zone_id");
        return json(await getResources(db, cityId, zoneId));
      }

      return new Response("Not found", { status: 404 });
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
