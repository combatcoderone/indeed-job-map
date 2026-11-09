const DEFAULTS = {
  center: "saint-laurent",
  radiusKm: 25,
  distanceMode: "driving_km",
  maxDriveMinutes: 30,
  keepRemote: true,
  autoStart: true,
  townsOnly: false,
  openInNewPage: true
};

function getElement(id) {
  return document.getElementById(id);
}

function setValue(id, value) {
  const el = getElement(id);
  if (el) el.value = value;
}

function setChecked(id, value) {
  const el = getElement(id);
  if (el) el.checked = value;
}

function setText(id, value) {
  const el = getElement(id);
  if (el) el.textContent = value;
}

function sendToTab(action) {
  return new Promise(function (resolve) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || !tabs.length) {
        resolve({ ok: false, reason: "no active tab" });
        return;
      }
      chrome.tabs.sendMessage(tabs[0].id, { action: action }, function (response) {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, reason: "Open an Indeed search page first, then try again." });
        } else {
          resolve(response || { ok: true });
        }
      });
    });
  });
}

function showStatus(message) {
  setText("status", message);
}

function loadSettings() {
  chrome.storage.sync.get(DEFAULTS, function (items) {
    const data = Object.assign({}, DEFAULTS, items || {});
    setValue("center", data.center);
    setValue("radius", data.radiusKm);
    setText("radiusLabel", data.radiusKm + " km");
    setValue("distanceMode", data.distanceMode);
    setValue("maxDriveMinutes", data.maxDriveMinutes);
    setText("driveLabel", data.maxDriveMinutes + " min");
    setChecked("keepRemote", data.keepRemote !== false);
    setChecked("autoStart", data.autoStart !== false);
    setChecked("townsOnly", data.townsOnly === true);
    setValue("openInNewPage", data.openInNewPage === false ? "same" : "new");
  });
}

function saveSettings() {
  const data = {};
  const center = getElement("center");
  const radius = getElement("radius");
  const distanceMode = getElement("distanceMode");
  const maxDriveMinutes = getElement("maxDriveMinutes");
  const keepRemote = getElement("keepRemote");
  const autoStart = getElement("autoStart");
  const townsOnly = getElement("townsOnly");
  const openInNewPage = getElement("openInNewPage");

  if (center) data.center = center.value;
  if (radius) {
    data.radiusKm = parseInt(radius.value, 10);
    setText("radiusLabel", data.radiusKm + " km");
  }
  if (distanceMode) data.distanceMode = distanceMode.value;
  if (maxDriveMinutes) {
    data.maxDriveMinutes = parseInt(maxDriveMinutes.value, 10);
    setText("driveLabel", data.maxDriveMinutes + " min");
  }
  if (keepRemote) data.keepRemote = keepRemote.checked;
  if (autoStart) data.autoStart = autoStart.checked;
  if (townsOnly) data.townsOnly = townsOnly.checked;
  if (openInNewPage) data.openInNewPage = openInNewPage.value === "new";

  if (!Object.keys(data).length) return;
  chrome.storage.sync.set(data, function () {
    if (chrome.runtime.lastError) {
      showStatus("Could not save settings: " + chrome.runtime.lastError.message);
      return;
    }
    sendToTab("settingsUpdated");
  });
}

function onClick(id, handler) {
  const el = getElement(id);
  if (el) el.addEventListener("click", handler);
}

document.addEventListener("DOMContentLoaded", function () {
  loadSettings();

  ["center", "radius", "distanceMode", "maxDriveMinutes", "keepRemote",
    "autoStart", "townsOnly", "openInNewPage"].forEach(function (id) {
    const el = getElement(id);
    if (el) {
      el.addEventListener("change", saveSettings);
      if (el.type === "range") el.addEventListener("input", saveSettings);
    }
  });

  onClick("showCurrentJob", async function () {
    showStatus("Showing the open job on the map.");
    const result = await sendToTab("showCurrentJobOnMap");
    if (result && result.ok) showStatus("Showing on the map: " + (result.title || "current job"));
    else showStatus((result && result.reason) || "Could not show that job. Open a job from an Indeed search page first.");
  });

  onClick("openMap", async function () {
    showStatus("Opening the map. Scroll Indeed to load jobs before opening the map.");
    const result = await sendToTab("showMap");
    if (result && result.ok === false) showStatus(result.reason || "Could not open the map. Open an Indeed search page first.");
  });

  onClick("nextPage", async function () {
    showStatus("Going to next page.");
    const result = await sendToTab("nextPage");
    if (result && !result.ok) showStatus(result.reason || "No next page was found.");
  });

  onClick("prevPage", async function () {
    showStatus("Going to previous page.");
    const result = await sendToTab("prevPage");
    if (result && !result.ok) showStatus(result.reason || "You are already on page 1.");
  });

  onClick("showAll", async function () {
    const result = await sendToTab("showAll");
    showStatus(result && result.ok === false ? (result.reason || "Could not show all jobs.") : "Showing all jobs again.");
  });

  onClick("resetAll", async function () {
    const result = await sendToTab("resetAll");
    showStatus(result && result.ok === false
      ? (result.reason || "Could not reset results.")
      : "All results reset. Your center, radius and other settings are kept.");
  });

  onClick("goTop", function () { sendToTab("goTop"); });
  onClick("goBottom", function () { sendToTab("goBottom"); });

  sendToTab("getStatus").then(function (result) {
    if (result && result.ok) {
      showStatus("Page " + result.page + ". Loaded " + result.total +
        " jobs. Next page: " + (result.hasNext ? "yes" : "no") +
        ". Previous page: " + (result.hasPrev ? "yes" : "no") + ".");
    }
  });
});
