import { saveToDB } from "../../functions/saveToDB.js";

export async function normalizeArticle(article) {
  await saveToDB("articles", article);
}
