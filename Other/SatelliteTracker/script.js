let simulationStartTime = new Date(); // Actual simulation start time
let simulationSpeed = 1;              // 1x real-time by default
let simulationNow = new Date();       // Current simulation "now" in simulated time
let pastHours = 3;                   // Default past trail = X hours
let futureHours = 3;                 // Default future trail = Y hours
let simulationRunning = true;
let simulationStartedTime = new Date(); // wall clock when sim began
let simulationPausedAt = null;          // wall clock when paused
let pausedTimeAccumulator = 0;          // total ms paused

let nightLayer = null;                // Layer for day/night shading
let wrapTrails = false; // Default: neat classic wrapping, no infinite

const map = L.map('map', { zoomControl: false,        // allow the zoom buttons
  scrollWheelZoom: false,   // disable zooming with mouse wheel
  doubleClickZoom: false,   // disable zooming on double click
  touchZoom: false,         // disable pinch zoom
  boxZoom: false,           // disable shift+drag box zoom, 
  zoomAnimation: false }).setView([0, 0], 2);
L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function toggleSimulation() {
  if (simulationRunning) pauseSimulation(); else startSimulation();
  document.getElementById('toggleSimButton').textContent = simulationRunning ? 'Pause' : 'Start';
}

function startSimulation() {
  if (!simulationRunning) {
    simulationRunning = true;
    const now = new Date();
    if (simulationPausedAt != null) {
      pausedTimeAccumulator += now - simulationPausedAt; // accumulate paused time
    }
  }
}

function pauseSimulation() {
  if (simulationRunning) {
    simulationRunning = false;
    simulationPausedAt = new Date(); // record time when paused
  }
}

function applyWrapSetting() {
  wrapTrails = document.getElementById('wrapToggle').checked;
  updateTrails();
  drawSatellites();
  updateNightOverlay();
}

function togglePanel(id) {
  const panel = document.getElementById(id);
  panel.classList.toggle('hidden');
}

const satelliteIcon = L.icon({
  iconUrl: 'satellite.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const satellitesData = {}; 
// satellitesData[noradId] = {
//   name,
//   tle1,
//   tle2,
//   satrec: null,
//   marker: null,
//   trailFuture: null,
//   trailPast: null,
//   lastWrappedLon: null,
//   lonWrapOffset: 0
// };

function isTLEStale() {
  const lastFetched = parseInt(localStorage.getItem('tleTimestamp'), 10);
  return !lastFetched || (Date.now() - lastFetched > 6 * 60 * 60 * 1000); // 6 hours
}

async function fetchTLE() {
  const response = await fetch('https://celestrak.org/NORAD/elements/stations.txt');
  if (!response.ok) {
    throw new Error(`Failed to fetch TLE: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  if (text.startsWith('<!DOCTYPE html>')) {
    throw new Error('TLE download failed: Received HTML instead of data.');
  }
  localStorage.setItem('tleData', text);
  localStorage.setItem('tleTimestamp', Date.now().toString());
}

async function initialize() {
  if (!localStorage.getItem('tleData') || isTLEStale()) {
    await fetchTLE();
  }
  const text = localStorage.getItem('tleData')
  const lines = text.trim().split('\n');
  for (let i = 0; i < lines.length; i += 3) {
    const name = lines[i].trim();
    const tle1 = lines[i+1].trim();
    const tle2 = lines[i+2].trim();
    const noradId = parseInt(tle1.substring(2, 7).trim());

    satellitesData[noradId] = {
      name,
      tle1,
      tle2,
      satrec: null,
      marker: null,
      trailFuture: null,
      trailPast: null,
      lastWrappedLon: null,
      lonWrapOffset: 0
    };
  }
  populateSatelliteList();
}

function populateSatelliteList() {
  const list = document.getElementById('satelliteList');
  Object.keys(satellitesData).forEach(noradId => {
    const sat = satellitesData[noradId];
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${noradId}" onchange="toggleSatellite(${noradId}, this.checked)"> ${sat.name}<br>`;
    list.appendChild(label);
  });
}

window.toggleSatellite = function(noradId, enabled) {
  const sat = satellitesData[noradId];
  if (enabled) {
    sat.satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);

    // Immediately compute current position
    const now = new Date();
    const posVel = satellite.propagate(sat.satrec, now);

    if (posVel.position) {
      const gmst = satellite.gstime(now);
      const pos = satellite.eciToGeodetic(posVel.position, gmst);
      const lat = satellite.degreesLat(pos.latitude);
      const lon = satellite.degreesLong(pos.longitude);

      // Create marker at correct position
      sat.marker = L.marker([lat, lon], { icon: satelliteIcon }).addTo(map);
    } else {
      console.warn(`Cannot propagate satellite ${sat.name}`);
    }

    updateTrails();
  } else {
    if (sat.marker) map.removeLayer(sat.marker);
    if (sat.trailFuture) map.removeLayer(sat.trailFuture);
    if (sat.trailPast) map.removeLayer(sat.trailPast);
    sat.marker = null;
    sat.trailFuture = null;
    sat.trailPast = null;
  }
}

function drawSatellites() {
  Object.values(satellitesData).forEach(sat => {
    if (!sat.satrec || !sat.marker) return;
  
    const posVel = satellite.propagate(sat.satrec, simulationNow);
    if (!posVel.position) return;
  
    const gmst = satellite.gstime(simulationNow);
    const pos = satellite.eciToGeodetic(posVel.position, gmst);
    const lat = satellite.degreesLat(pos.latitude);
    let lon = satellite.degreesLong(pos.longitude);
  
    if (sat.lastWrappedLon !== null) {
      const delta = lon - sat.lastWrappedLon;

      if (delta > 180) {
        sat.lonWrapOffset -= 360;
      } else if (delta < -180) {
        sat.lonWrapOffset += 360;
      }
    }

    sat.lastWrappedLon = lon;
    if (wrapTrails) {
      lon += sat.lonWrapOffset;
    }
  
    sat.marker.setLatLng([lat, lon]);
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (!simulationRunning) {
    return;
  }

  const realNow = new Date();
  const elapsedRealTime = (realNow - simulationStartedTime - pausedTimeAccumulator) / 1000;
  const simulatedElapsed = elapsedRealTime * simulationSpeed;

  simulationNow = new Date(simulationStartTime.getTime() + simulatedElapsed * 1000);

  document.getElementById('simClock').textContent =
    simulationNow.toISOString().replace('T', ' ').slice(0, 19);

  drawSatellites();

  updateNightOverlay();
  
}

function updateTrails() {
  const now = simulationStartTime;
  Object.values(satellitesData).forEach(sat => {
    if (!sat.satrec || !sat.marker) return;

    let futureSegments = [[]];
    let pastSegments = [[]];

    let prevLon = null;
    if (futureHours != 0) {
      // Future trail
      for (let i = 0; i <= futureHours * 60; i++) {
        const time = new Date(now.getTime() + i * 60 * 1000);
        const posVel = satellite.propagate(sat.satrec, time);

        if (posVel.position) {
          const gmst = satellite.gstime(time);
          const pos = satellite.eciToGeodetic(posVel.position, gmst);
          let lat = satellite.degreesLat(pos.latitude);
          let lon = satellite.degreesLong(pos.longitude);

          if (prevLon !== null) {
            if (!wrapTrails && Math.abs(lon - prevLon) > 180) {
              futureSegments.push([]);
            }
            if (wrapTrails) {
              while (lon - prevLon > 180) lon -= 360;
              while (lon - prevLon < -180) lon += 360;
            }
          }

          futureSegments[futureSegments.length - 1].push([lat, lon]);
          prevLon = lon;
        }
      }
    }
    if (pastHours != 0) {
      // Past trail
      prevLon = null;
      for (let i = 0; i <= pastHours * 60; i++) {
        const time = new Date(now.getTime() - i * 60 * 1000);
        const posVel = satellite.propagate(sat.satrec, time);

        if (posVel.position) {
          const gmst = satellite.gstime(time);
          const pos = satellite.eciToGeodetic(posVel.position, gmst);
          let lat = satellite.degreesLat(pos.latitude);
          let lon = satellite.degreesLong(pos.longitude);

          if (prevLon !== null) {
            if (!wrapTrails && Math.abs(lon - prevLon) > 180) {
              pastSegments.push([]);
            }
            if (wrapTrails) {
              while (lon - prevLon > 180) lon -= 360;
              while (lon - prevLon < -180) lon += 360;
            }
          }

          pastSegments[pastSegments.length - 1].push([lat, lon]);
          prevLon = lon;
        }
      }
    }
    if (sat.trailFuture) map.removeLayer(sat.trailFuture);
    if (sat.trailPast) map.removeLayer(sat.trailPast);

    sat.trailFuture = L.layerGroup(
      futureSegments
        .filter(segment => segment.length > 1)
        .map(segment => L.polyline(segment, { color: 'blue' }))
    ).addTo(map);

    sat.trailPast = L.layerGroup(
      pastSegments
        .filter(segment => segment.length > 1)
        .map(segment => L.polyline(segment, { color: 'green' }))
    ).addTo(map);
  });
}

function updateInfoBox() {
  const box = document.getElementById('infoBox');
  box.innerHTML = ''; // Keep empty for now
}

function applyTimeSettings() {
  const startTimeStr = document.getElementById('startTimeInput').value;
  if (startTimeStr) {
    simulationStartTime = new Date(startTimeStr);
  }
  simulationNow = new Date(simulationStartTime);
  simulationSpeed = parseFloat(document.getElementById('speedInput').value) || 1;
  pastHours = parseFloat(document.getElementById('pastHoursInput').value) || 24;
  futureHours = parseFloat(document.getElementById('futureHoursInput').value) || 24;
  Object.values(satellitesData).forEach(sat => {
    sat.lonWrapOffset = 0;
    sat.lastWrappedLon = null;
  });
  updateTrails();
  pausedTimeAccumulator = 0;
  simulationStartedTime = new Date();
  simulationPausedAt = simulationStartedTime;
  drawSatellites();
  updateNightOverlay();
}

function updateNightOverlay() {
  if (nightLayer) {
    map.removeLayer(nightLayer);
  }

  const base = terminator(simulationNow);
  const latLngs = base.getLatLngs()[0];
  const maxLat = 85.05112878;

  // Get the current map longitude bounds
  const bounds = map.getBounds();
  const minLng = bounds.getWest();
  const maxLng = bounds.getEast();

  // How many 360° segments to cover
  const startWrap = Math.floor(minLng / 360) * 360;
  const endWrap   = Math.ceil(maxLng / 360) * 360;

  const layers = [];

  for (let offset = startWrap; offset <= endWrap; offset += 360) {
    const shifted = L.polygon(
      latLngs.map(({ lat, lng }) => [
        Math.max(Math.min(lat, maxLat), -maxLat),
        lng + offset
      ]),
      {
        color: null,
        fillColor: 'black',
        fillOpacity: 0.4,
        weight: 0,
        interactive: false
      }
    );
    layers.push(shifted);
  }

  nightLayer = L.layerGroup(layers);
  nightLayer.addTo(map);
}

window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                  .toISOString()
                  .slice(0, 16);
  document.getElementById('startTimeInput').value = local;
});

animate();

map.on('moveend zoomend', updateNightOverlay);

initialize();
