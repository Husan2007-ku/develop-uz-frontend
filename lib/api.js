const API_URL = "https://develop-uz-api.onrender.com";

export async function getEssays(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/essays/?${query}`, {
    cache: "no-store"
  });
  return res.json();
}

export async function getEssay(id) {
  const res = await fetch(`${API_URL}/essays/${id}`, {
    cache: "no-store"
  });
  return res.json();
}

export async function getVocabulary(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/vocabulary/?${query}`, {
    cache: "no-store"
  });
  return res.json();
}

export async function getTopics() {
  const res = await fetch(`${API_URL}/topics/`, {
    cache: "no-store"
  });
  return res.json();
}

export async function searchVocabulary(query) {
  const res = await fetch(
    `${API_URL}/vocabulary/search/${query}`,
    { cache: "no-store" }
  );
  return res.json();
}