// Written by scripts/build.py from sites/inventory/site.json and features.json. Edit those, not this file.
window.GA_CONFIG = {
 "key": "inventory",
 "collection": true,
 "siteTitle": "Isthmia Inventory Cards",
 "pageTitle": "Isthmia Inventory Cards — Isthmia Excavations",
 "description": "Browse the inventory cards of the UCLA/OSU/MSU excavations at Isthmia.",
 "brand": {
  "mark": "Ι",
  "sub": "Isthmia Excavations · Inventory Cards"
 },
 "theme": {
  "accent": "#5a4a8a",
  "accentInk": "#43366b",
  "accentSoft": "#e6e1f1"
 },
 "contact": "freyjona@msu.edu",
 "searchPlaceholder": "Search IDs, titles…",
 "exportName": "isthmia-inventory-cards",
 "noun": {
  "one": "card",
  "many": "cards"
 },
 "dataUrl": "data/archive.json",
 "imageBase": "https://inventorycards.s3.amazonaws.com/",
 "thumbBase": "https://inventorycards.s3.amazonaws.com/optimized/400/",
 "mediumBase": "https://inventorycards.s3.amazonaws.com/optimized/1600/",
 "imageFormats": [
  "avif",
  "webp"
 ],
 "hideOriginals": true,
 "thumbsReady": false,
 "permalinkPath": "inventory",
 "uploads": {
  "signer": ""
 },
 "fields": {
  "id": "ID",
  "title": "Title",
  "titleFallback": [
   "ID"
  ],
  "caption": [
   "ID"
  ],
  "boardCaption": [
   "ID"
  ],
  "location": "",
  "geo": "",
  "images": [
   {
    "field": "File name",
    "urlField": "Image_URL"
   }
  ],
  "date": null,
  "created": null
 },
 "labels": {
  "Image_URL": "Full-size image"
 },
 "views": [
  "gallery",
  "table"
 ],
 "groupable": [],
 "keyFields": [
  "ID",
  "Title"
 ],
 "facetFields": [],
 "linkFields": [],
 "sorts": [
  [
   "f:ID",
   "ID"
  ],
  [
   "title",
   "Title A–Z"
  ]
 ],
 "table": {
  "cols": [
   "ID",
   "Title",
   "URI"
  ],
  "widths": {
   "ID": 140,
   "Title": 300
  }
 },
 "editor": {
  "readOnly": [],
  "defaultCols": [
   "ID",
   "Title",
   "File name",
   "Image_URL"
  ],
  "widths": {
   "Title": 260,
   "File name": 200,
   "Image_URL": 320
  },
  "categorical": [],
  "textarea": [
   "Title"
  ],
  "issues": [
   "missing:Title",
   "no-image"
  ],
  "upload": {
   "fields": [],
   "defaults": {}
  }
 },
 "hub": {
  "type": "Inventory card",
  "area": "",
  "trench": "",
  "people": "",
  "year": "",
  "search": [
   "Title"
  ],
  "only": "",
  "cut": false
 },
 "viewer": {
  "background": "light"
 },
 "features": {
  "gallery": true,
  "boxes": false,
  "table": true,
  "charts": false,
  "map": false,
  "sitePhoto": false,
  "background": "light",
  "cardPair": false,
  "scaleBar": false,
  "pages": true,
  "combined": true,
  "editor": true
 },
 "adminRepo": "tregodan-msu/isthmia",
 "permalinkBase": "https://tregodan-msu.github.io/isthmia-site/",
 "hubSite": {
  "key": "isthmia",
  "title": "Isthmia Archives",
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
  },
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
   ],
   "North Drain": [
    37.917399,
    22.996112
   ]
  }
 },
 "idPrefix": "IC",
 "formerIds": ""
};
