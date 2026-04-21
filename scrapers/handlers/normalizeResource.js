import { saveToDB } from "../../functions/saveToDB.js";

export async function normalizeResource(resource) {
  await saveToDB("community_resources", resource);
}
