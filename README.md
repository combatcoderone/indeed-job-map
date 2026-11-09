# Indeed Radius Filter Simple v1.0

Simple version, no automation. It only shows jobs on the map.

## What it does
- You scroll Indeed yourself, in the normal way. The extension does not auto scroll, does not auto load all, does not auto filter, and does not go through pages by itself.
- Click Show map in the Indeed panel, or Open map view in the extension popup.
- It collects the jobs that are already loaded on the page you are on, and shows them on OpenStreetMap.
- Blue pin is your center, blue circle is your radius, green pin is inside your radius, red pin is outside.
- Click a pin for a small popup with the job title, location, distance, and an Open button. It opens in a new tab by default, using the job key, data-jk, as https://ca.indeed.com/viewjob?jk=, so it opens the right job.
- Map stays inside Canada, latitude 41 to 84, longitude -141 to -52. It does not zoom out by itself, use Fit all pins if you want to see all of them.
- Jobs outside Canada, or with no place, are in a small collapsed list below the map, not as a popup.
- Buttons on the map: Filter by circle, Filter by map view, Reset center, Fit all pins, Refresh map, Reset all results, Show all.
- Reset all results: shows all jobs again, clears the map pins, stops any automated mode, and keeps your center, radius and other settings.
- It does not work on a job detail page, /viewjob. Open an Indeed search list first, /jobs.

## What it does not do
- No auto scroll to the end.
- No Load all, no automated all pages mode, no Pause, Resume, or Stop for loading.
- No rest timer, no Slow, Normal, Fast speeds.
- No auto load when you click the first job.

## Settings
- Center, radius, distance method, max driving time, Keep remote, Only Saint-Laurent and West Island towns when the exact place is unknown, and Open job in New page or Same page.
- Change the center in the popup, or drag the blue pin on the map, or click Reset center.

## Install in Chrome
1. Remove any other Indeed Radius Filter version first, in chrome://extensions, so the simple and full versions do not run at the same time.
2. Unzip indeed-radius-filter-simple-v1.0.zip and keep the folder indeed-radius-filter-simple.
3. Open Chrome and go to chrome://extensions
4. Turn on Developer mode, top right.
5. Click Load unpacked.
6. Choose the folder indeed-radius-filter-simple (the folder with manifest.json in it, not the zip file itself).
7. Open ca.indeed.com, run a job search, scroll down yourself to load jobs, then click Show map.

## Files
- manifest.json: name Indeed Radius Filter Simple, version 1.0.0
- leaflet/leaflet.js and leaflet/leaflet.css: Leaflet 1.9.4, bundled locally
- content.js, content.css, popup.html, popup.js, popup.css
- icons/icon16.png, icon32.png, icon48.png, icon128.png, icon256.png, icon512.png: the logo

## v1.1: Show on map button in the job detail
- New button Show on map, in the job detail at the top, next to Apply on company site, the bookmark and share buttons.
- Click it, and the map opens, centers on that job, zoom 12, and opens that job pin popup, with the title, location, distance, and Open button.
- It finds the open job by its job key, vjk in the web address, or the selected card. If that job is not in the loaded list yet, it collects the current page first, then shows it. If the job has no place, it says so and shows it in the small list below the map.
- Simple version still has no automation. It does not scroll the list, it does not start Load all.

## v1.2 fix: Show on map button did not appear
Cause in v1.1: the button looked only inside a guessed detail container, data-testid job-detail or .jobsearch-JobComponent. Indeed does not always use those selectors, so the button was never added.
Fix in v1.2: the button now finds the Apply button anywhere on the page, Apply on company site or Apply now, and inserts the Show on map button right after it.
Fallbacks: Indeed panel has Show this job on map, and the extension popup has Show open job on map. Both do the same thing.

## v1.3 fix: button in wrong place, and map not showing the company place
Same fix as full v1.14: Show on map is now appended to the row with Apply, bookmark, thumbs down and share, as a small button to the right of share, not below Apply. And Show on map re-finds the job after opening the map, fixes its place from the job detail, Blainville, QC, then centers on it.

## v1.4 fix: company names are wrong when open in map
Same fix as full v1.15: detail location is only used if the detail title matches the job, never the whole document, broad location selector removed, company stored separately and shown separately in the popup.

## v1.5 fix: wrong direction showed and the map is not even opened
Same fix as full v1.16: Show on map opens the map first, always, then looks for the job, shows a clear message in the map detail bar if it cannot find it, and does not reset the view to the center when focusing a job.
