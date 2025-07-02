// client/api/history.js
async function fetchHistory(userId, skip = 0, limit = 20) {
    const res = await fetch(`/history?userId=${userId}&skip=${skip}&limit=${limit}`);
    const json = await res.json();
    return json.data;
  }
  