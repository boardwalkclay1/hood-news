import { saveToDB } from "../../functions/saveToDB.js";

export async function normalizeJob(job) {
  await saveToDB("jobs", job);
}
