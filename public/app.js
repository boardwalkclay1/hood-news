const API = location.origin.replace(/^https?:\/\//, "https://") + "/api";

const citySelect = document.getElementById("citySelect");
const zoneSelect = document.getElementById("zoneSelect");

async function loadCities() {
  const res = await fetch(`${API}/cities`);
  const cities = await res.json();

  citySelect.innerHTML = cities
    .map(c => `<option value="${c.id}">${c.name}</option>`)
    .join("");

  loadZones();
  loadAllData();
}

async function loadZones() {
  const cityId = citySelect.value;
  const res = await fetch(`${API}/zones?city_id=${cityId}`);
  const zones = await res.json();

  zoneSelect.innerHTML = zones
    .map(z => `<option value="${z.id}">${z.name}</option>`)
    .join("");

  loadAllData();
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
  const res = await fetch(url);
  const data = await res.json();

  const list = document.getElementById(`${type}List`);
  list.innerHTML = data
    .map(item => `
      <div class="item">
        <h3>${item.title || item.name}</h3>
        <p>${item.description || item.summary || ""}</p>
      </div>
    `)
    .join("");
}

citySelect.addEventListener("change", loadZones);
zoneSelect.addEventListener("change", loadAllData);

loadCities();
