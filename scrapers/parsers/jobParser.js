export async function scrapeJobs(url, source) {
  const res = await fetch(url);
  const jobs = [];

  const rewriter = new HTMLRewriter()
    .on(".job, .listing, .job-item", {
      element(el) {
        const title = el.querySelector("h2,h3")?.textContent || "";
        const company = el.querySelector(".company")?.textContent || "";
        const link = el.querySelector("a")?.getAttribute("href") || "";

        if (title && link) {
          jobs.push({
            city_id: source.city_id,
            zone_id: source.zone_id,
            title,
            company,
            description: "",
            apply_url: absoluteURL(url, link),
            posted_at: null
          });
        }
      }
    });

  await rewriter.transform(res).text();

  return jobs;
}
