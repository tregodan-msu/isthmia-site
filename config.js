// Written by scripts/build.py from sites/isthmia/site.json and features.json. Edit those, not this file.
window.GA_CONFIG = {
 "key": "isthmia",
 "combined": true,
 "siteTitle": "Isthmia Archives",
 "pageTitle": "Isthmia Archives — Excavation records in one place",
 "description": "Search the archives of the excavations at Isthmia together: photographs from the Gregory slide archive and coins from the Clement catalog, grouped by area, trench, date and ruler.",
 "brand": {
  "mark": "Ι",
  "sub": "Excavations at Isthmia · All archives"
 },
 "theme": {
  "accent": "#3d5a80",
  "accentInk": "#2c4563",
  "accentSoft": "#e1e8f0"
 },
 "storyUrl": "https://msuisthmia.org",
 "storyLabel": "MSU Excavations at Isthmia ↗",
 "searchPlaceholder": "Search every archive: areas, trenches, rulers, titles…",
 "exportName": "isthmia-archives",
 "noun": {
  "one": "record",
  "many": "records"
 },
 "cardPair": true,
 "viewer": {
  "background": "light",
  "removeBg": true,
  "bgTolerance": 32,
  "scale": {
   "field": "hasDiameter",
   "unit": "mm",
   "fill": 0.8
  },
  "scaleOn": true,
  "infoDefault": "key"
 },
 "dataUrl": "data/archive.json",
 "imageBase": "",
 "thumbsReady": false,
 "appsScriptUrl": "",
 "permalinkBase": "https://tregodan-msu.github.io/isthmia-site/",
 "permalinkPath": "record",
 "fields": {
  "id": "ID",
  "title": "Title",
  "titleFallback": [
   "Type"
  ],
  "caption": [
   "Archive",
   "Date"
  ],
  "boardCaption": [
   "Type",
   "Date"
  ],
  "location": "Area",
  "geo": "",
  "images": [
   {
    "field": "View 1",
    "urlField": "View 1",
    "label": "View 1"
   },
   {
    "field": "View 2",
    "urlField": "View 2",
    "label": "View 2"
   }
  ],
  "date": {
   "field": "Date",
   "label": "Date",
   "year": "Date (year)",
   "century": "Century"
  },
  "created": {
   "field": "Year",
   "label": "Excavation / photo year",
   "decade": "Decade recorded"
  }
 },
 "labels": {
  "INVENTORY NUMBER": "Inventory number",
  "CLEMENT NUMBER": "Clement number",
  "hasStatedAuthority": "Authority",
  "hasProductionDate": "Date",
  "hasObverse": "Obverse",
  "hasReverse": "Reverse",
  "hasWeight": "Weight (g)",
  "hasDiameter": "Diameter (mm)",
  "hasAxis": "Die axis",
  "hasFindContext": "Find context",
  "StratigraphicUnit": "Stratigraphic unit",
  "StratigraphicUnit Studied?": "Unit studied",
  "DepositionName": "Deposit",
  "DepositionType": "Deposit type",
  "SecondaryTreatment": "Secondary treatment",
  "ReferenceWork": "References",
  "ArchivalPhoto": "Archival photo",
  "DiscoveryDate": "Discovery date",
  "NOTEBOOK": "Notebook",
  "Notebook Page": "Notebook page",
  "NOTES": "Notes",
  "Region": "Find area",
  "Image_URL_1": "Obverse image",
  "Image_URL_2": "Reverse image",
  "Year": "Excavation / photo year",
  "Home record": "Full record in its archive",
  "View 1": "Image",
  "View 2": "Second image"
 },
 "views": [
  "gallery",
  "map",
  "boxes",
  "table",
  "charts"
 ],
 "map": {
  "areas": true,
  "field": "Area",
  "center": [
   37.91658,
   22.993225
  ],
  "zoom": 17,
  "base": {
   "type": "osm"
  },
  "photo": {
   "file": "site-photo.jpg",
   "label": "Site photo",
   "bounds": [
    [
     37.914736,
     22.991693
    ],
    [
     37.918006,
     22.996319
    ]
   ],
   "url": "img/site-photo.jpg",
   "home": "isthmia"
  }
 },
 "group": {
  "field": "Area",
  "nav": "Areas",
  "tab": "Areas",
  "plural": "areas",
  "one": "area",
  "numbered": false,
  "photos": false,
  "hint": "Open an area to see everything recorded there.",
  "map": false
 },
 "groupable": [
  "Area",
  "Archive",
  "Type",
  "Trench",
  "Ruler / authority",
  "Century",
  "Decade recorded"
 ],
 "keyFields": [
  "Archive",
  "Type",
  "Title",
  "Area",
  "Trench",
  "Date",
  "Ruler / authority",
  "Year",
  "Home record"
 ],
 "facetFields": [
  "Archive",
  "Type",
  "Area",
  "Trench",
  "Ruler / authority",
  "Period",
  "Mint",
  "Material",
  "Denomination",
  "Subject",
  "Creator",
  "Slide Box",
  "Year"
 ],
 "linkFields": [],
 "sorts": [
  [
   "box",
   "By archive"
  ],
  [
   "f:Area",
   "Area A–Z"
  ],
  [
   "title",
   "Title A–Z"
  ],
  [
   "subjOld",
   "Date, earliest first"
  ],
  [
   "subjNew",
   "Date, latest first"
  ],
  [
   "photoOld",
   "Year recorded, oldest"
  ],
  [
   "photoNew",
   "Year recorded, newest"
  ],
  [
   "f:Archive",
   "Archive"
  ]
 ],
 "table": {
  "cols": [
   "ID",
   "Archive",
   "Type",
   "Title",
   "Area",
   "Trench",
   "Date",
   "Ruler / authority",
   "Year",
   "Home record"
  ],
  "widths": {
   "Archive": 170,
   "Type": 100,
   "Title": 260,
   "Area": 150,
   "Trench": 120,
   "Date": 120,
   "Ruler / authority": 160,
   "Year": 80,
   "Home record": 320
  }
 },
 "numeric": [],
 "charts": {
  "defaultX": "Area",
  "stackSeries": [
   "Archive",
   "Type"
  ],
  "skip": [
   "View 1",
   "View 2",
   "Home record",
   "Image_URL",
   "Image_URL_1",
   "Image_URL_2",
   "Digital File Name"
  ],
  "defaults": [
   0,
   1,
   2
  ],
  "suggestions": [
   {
    "title": "Records by area",
    "type": "stacked",
    "x": "Area",
    "top": 15,
    "series": "Archive",
    "note": "What each archive holds for each part of the site"
   },
   {
    "title": "Across time",
    "type": "stacked",
    "x": "Date (year)",
    "bin": 100,
    "series": "Archive",
    "note": "Century of the coin or of the thing photographed"
   },
   {
    "title": "Share by archive",
    "type": "donut",
    "x": "Archive",
    "note": "How much each archive contributes"
   },
   {
    "title": "Most documented trenches",
    "type": "bar",
    "x": "Trench",
    "top": 20,
    "note": "Coins and photographs per trench"
   },
   {
    "title": "Rulers and authorities",
    "type": "bar",
    "x": "Ruler / authority",
    "top": 20,
    "note": "On coins, and named in photographs"
   },
   {
    "title": "Records per year",
    "type": "stacked",
    "x": "Excavation / photo year",
    "bin": 1,
    "series": "Archive",
    "note": "Excavation year of coins, year photographs were taken"
   }
  ]
 },
 "sources": [
  "gregory",
  "clement"
 ],
 "features": {
  "gallery": true,
  "boxes": true,
  "table": true,
  "charts": true,
  "map": "view",
  "sitePhoto": true,
  "background": "light",
  "cardPair": true,
  "scaleBar": true,
  "combined": true,
  "editor": true
 },
 "adminRepo": "tregodan-msu/isthmia",
 "hubSources": [
  "gregory",
  "clement"
 ],
 "places": {
  "Temple of Poseidon": [
   37.915747,
   22.993001
  ],
  "Roman Bath": [
   37.917391,
   22.993698
  ],
  "Theater": [
   37.91657,
   22.994524
  ],
  "East Field": [
   37.915733,
   22.995265
  ],
  "Greek Pool": [
   37.917131,
   22.993677
  ]
 },
 "areas": {
  "Roman Bath": [
   "R. Bath",
   "Rom. Bath",
   "Bath"
  ],
  "Greek Pool": [
   "Gr. Pool"
  ],
  "East Field": [
   "East Field Hoard",
   "E. Field"
  ],
  "Fortress": [
   "Byzantine Fortress"
  ],
  "Hexamilion": [
   "Hexamilion Outworks",
   "Hexamilion Wall"
  ],
  "Northeast Gate": [
   "North East Gate",
   "NE Gate",
   "N.E. Gate",
   "East Gate"
  ],
  "South Gate": [
   "S. Gate"
  ],
  "Tower #": [
   "Tower #",
   "T. #"
  ],
  "Theater": [
   "Theatre"
  ],
  "Temple of Poseidon": [
   "Temple"
  ],
  "East Temenos": [
   "E. Temenos"
  ],
  "Temenos": [],
  "West Cemetery": [
   "W. Cemetery"
  ],
  "Northwest Area": [
   "North West Area",
   "NW Area"
  ],
  "Gully Bastion": [],
  "North Drain": [],
  "Rachi": [],
  "Stadium": [],
  "Palaimonion": []
 }
};
