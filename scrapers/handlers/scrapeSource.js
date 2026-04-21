import { rssParser } from "../parsers/rssParser.js";
import { htmlParser } from "../parsers/htmlParser.js";
import { apiParser } from "../parsers/apiParser.js";
import { youtubeParser } from "../parsers/youtubeParser.js";
import { redditParser } from "../parsers/redditParser.js";
import { jobsParser } from "../parsers/jobsParser.js";
import { eventsParser } from "../parsers/eventsParser.js";
import { resourcesParser } from "../parsers/resourcesParser.js";

export async function scrapeSource(source) {
  switch (source.type) {
    case "rss": return rssParser(source);
    case "html": return htmlParser(source);
    case "api": return apiParser(source);
    case "youtube": return youtubeParser(source);
    case "reddit": return redditParser(source);
    case "jobs": return jobsParser(source);
    case "events": return eventsParser(source);
    case "resources": return resourcesParser(source);
    default:
      throw new Error(`Unknown source type: ${source.type}`);
  }
}
