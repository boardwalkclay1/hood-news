import { fetchHTML } from "../../functions/fetchHTML.js";
import { extractText } from "../../functions/extractText.js";

export async function jobsParser(source) {
  const html = await fetchHTML(source.url);
  const jobs = extractText(html, "jobs");

  return jobs.map(job => ({
    city_id: source.city_id,
    zone_id: source.zone_id,
    title: job.title,
    company: job.company,
    description: job.description,
    apply_url: job.apply_url,
    posted_at: job.posted_at || null
  }));
}
