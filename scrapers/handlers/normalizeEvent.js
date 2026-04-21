import { saveToDB } from "../../functions/saveToDB.js";

export async function normalizeEvent(event) {
  await saveToDB("community_events", event);
}
