import { NEWS_KEY } from "../../env";

const BASE = "https://newsapi.org/v2";

const toStory = (article, category) => ({
  id: article.url,
  title: article.title || "Untitled",
  summary:
    article.description ||
    (article.content ? article.content.split("…")[0] + "…" : ""),
  url: article.url,
  image: article.urlToImage,
  category,
});

export const fetchTrending = async (categoryIds = [], page = 1) => {
  if (!categoryIds.length) return [];

  const oneCall = async (id) => {
    const keywords = {
      1: "environment climate",
      2: '"human rights" OR equality',
      3: "poverty inequality",
      4: "health wellbeing",
      5: "education youth",
      6: "politics governance democracy",
      7: "technology ethics AI",
      8: "conflict peace",
      9: "culture community",
    }[id];

    const url = `${BASE}/everything?q=${encodeURIComponent(
      keywords
    )}&language=en&pageSize=20&page=${page}&sortBy=publishedAt&apiKey=${NEWS_KEY}`;

    const res = await fetch(url);
    const json = await res.json();
    if (json.status !== "ok") throw new Error(json.message);
    return json.articles.map((a) => toStory(a, id));
  };

  const chunks = await Promise.all(categoryIds.map(oneCall));
  return chunks.flat();
};

export const searchStories = async (query, page = 1) => {
  const url = `${BASE}/everything?q=${encodeURIComponent(
    query
  )}&language=en&pageSize=30&page=${page}&sortBy=relevancy&apiKey=${NEWS_KEY}`;

  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== "ok") throw new Error(json.message);
  return json.articles.map((a) => toStory(a, null));
};

export const getFullStory = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return { html, sourceUrl: url };
};
