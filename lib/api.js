const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://develop-uz-api.onrender.com";

// Telegram Mini App ichida ishga tushganda avtomatik init_data yuboradi.
// Oddiy veb-brauzerda esa (Telegram'siz) lib/auth-context.jsx saqlagan JWT
// token ishlatiladi (localStorage). Ikkisi bir vaqtda bo'lmaydi — qaysi
// muhitda ochilgan bo'lsa, o'shani yuboradi. Bu funksiya barcha so'rovlar
// orqali o'tadi — endi auth header'ni har joyda qo'lda yozish shart emas.
function authHeaders(extra = {}) {
  const initData =
    typeof window !== "undefined" && window.Telegram?.WebApp?.initData
      ? window.Telegram.WebApp.initData
      : "";

  let token = "";
  try {
    token = typeof window !== "undefined"
      ? window.localStorage.getItem("develop-uz-token") || ""
      : "";
  } catch {}

  return {
    "Content-Type": "application/json",
    ...(initData ? { "X-Telegram-Init-Data": initData } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers: authHeaders(options.headers),
  });
  if (!res.ok) {
    throw new Error(`API xato: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getEssays(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/essays/?${query}`);
}

export async function getEssay(id) {
  return apiFetch(`/essays/${id}`);
}

export async function getVocabulary(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/vocabulary/?${query}`);
}

export async function getTopics() {
  return apiFetch(`/topics/`);
}

export async function searchVocabulary(query) {
  return apiFetch(`/vocabulary/search/${encodeURIComponent(query)}`);
}

// Yangi: SM-2 review endpoint (bot va webapp endi bitta manbadan foydalanadi)
export async function reviewWord(telegramId, vocabId, correct) {
  return apiFetch(`/vocabulary/user/${telegramId}/${vocabId}/review`, {
    method: "PATCH",
    body: JSON.stringify({ correct }),
  });
}

export { API_URL, apiFetch, authHeaders };
