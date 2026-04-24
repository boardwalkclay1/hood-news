// Worker exposes /api/* routes
const API = "/api";

const citySelect = document.getElementById("citySelect");
const zoneSelect = document.getElementById("zoneSelect");
const tickerContent = document.getElementById("tickerContent");

async function loadCities() {
  try {
    const res = await fetch(`${API}/cities`);
    const cities = await res.json();

    if (!Array.isArray(cities) || cities.length === 0) {
      citySelect.innerHTML = `<option>No cities</option>`;
      return;
    }

    citySelect.innerHTML = cities
      .map(c => `<option value="${c.id}">${c.name}</option>`)
      .join("");

    await loadZones();
    await loadAllData();
  } catch (e) {
    console.error("Error loading cities", e);
  }
}

async function loadZones() {
  try {
    const cityId = citySelect.value;
    const res = await fetch(`${API}/zones?city_id=${cityId}`);
    const zones = await res.json();

    if (!Array.isArray(zones) || zones.length === 0) {
      zoneSelect.innerHTML = `<option value="">All zones</option>`;
      return;
    }

    zoneSelect.innerHTML = zones
      .map(z => `<option value="${z.id}">${z.name}</option>`)
      .join("");
  } catch (e) {
    console.error("Error loading zones", e);
  }
}

async function loadAllData() {
  const cityId = citySelect.value;
  const zoneId = zoneSelect.value;

  loadSection("articles", `${API}/articles?city_id=${cityId}`);
  loadSection("jobs", `${API}/jobs?city_id=${cityId}&zone_id=${zoneId}`);
  loadSection("events", `${API}/events?city_id=${cityId}&zone_id=${zoneId}`);
  loadSection("resources", `${API}/resources?city_id=${cityId}&zone_id=${zoneId}`);
}

async function loadSection(type, url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    const list = document.getElementById(`${type}List`);
    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = `<div class="item"><p>No ${type} found.</p></div>`;
      if (type === "articles") updateTicker([]);
      return;
    }

    list.innerHTML = data
      .map(item => `
        <div class="item">
          <h3>${item.title || item.name || "Untitled"}</h3>
          <p>${item.description || item.summary || ""}</p>
        </div>
      `)
      .join("");

    if (type === "articles") updateTicker(data);
  } catch (e) {
    console.error(`Error loading ${type}`, e);
  }
}

function updateTicker(articles) {
  if (!articles || articles.length === 0) {
    tickerContent.textContent = "No headlines yet. Scrapers are cooking...";
    return;
  }

  const headlines = articles
    .slice(0, 8)
    .map(a => (a.title || a.name || "").trim())
    .filter(Boolean);

  if (headlines.length === 0) {
    tickerContent.textContent = "No headlines yet. Scrapers are cooking...";
    return;
  }

  tickerContent.textContent = headlines.join("   •   ");
}

citySelect.addEventListener("change", async () => {
  await loadZones();
  await loadAllData();
});

zoneSelect.addEventListener("change", loadAllData);

// Remove newspaper flash after animation
setTimeout(() => {
  const flash = document.getElementById("newspaperFlash");
  if (flash) flash.remove();
}, 2500);

// Kick off
loadCities();
