// Written by scripts/build.py from sites/clement/site.json and features.json. Edit those, not this file.
window.GA_CONFIG = {
 "key": "clement",
 "siteTitle": "Clement Coin Catalog",
 "pageTitle": "Clement Coin Catalog — Isthmia Excavations",
 "description": "Browse and search the coins from the UCLA/OSU/MSU excavations at Isthmia catalogued by Paul A. Clement: obverse and reverse photographs, mints, dates, weights and find contexts.",
 "brand": {
  "mark": "Κ",
  "sub": "Isthmia Excavations · Coins"
 },
 "theme": {
  "accent": "#2f6b64",
  "accentInk": "#214f4a",
  "accentSoft": "#dcebe8"
 },
 "contact": "freyjona@msu.edu",
 "pages": {
  "tab": "Info",
  "footer": "All images in the Isthmia Coin Collection are shared under a Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).",
  "list": [
   {
    "slug": "about",
    "title": "About the catalog",
    "description": "The Paul A. Clement Catalog of Coins from the excavations at Isthmia, Paul A. Clement, and how the images may be used."
   },
   {
    "slug": "methodology",
    "title": "Methodology",
    "description": "How the Isthmia coins were photographed, described and checked."
   },
   {
    "slug": "project",
    "title": "The Isthmia archives",
    "description": "The project that brings the records of the excavations at Isthmia together, and its other archives."
   },
   {
    "slug": "takedown-policy",
    "title": "Takedown policy",
    "description": "How to ask the Clement Coin Catalog to review or remove an image."
   }
  ]
 },
 "searchPlaceholder": "Search rulers, mints, legends, inventory numbers…",
 "exportName": "clement-coins",
 "noun": {
  "one": "coin",
  "many": "coins"
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
 "imageBase": "https://isthmiacoins.s3.amazonaws.com/",
 "thumbBase": "https://isthmiacoins.s3.amazonaws.com/thumbs/400/",
 "mediumBase": "https://isthmiacoins.s3.amazonaws.com/thumbs/1600/",
 "thumbsReady": false,
 "permalinkBase": "https://tregodan-msu.github.io/clementcoins/",
 "permalinkPath": "coin",
 "fields": {
  "id": "INVENTORY NUMBER",
  "title": "hasStatedAuthority",
  "titleFallback": [
   "Mint",
   "INVENTORY NUMBER"
  ],
  "caption": [
   "INVENTORY NUMBER",
   "hasProductionDate"
  ],
  "boardCaption": [
   "INVENTORY NUMBER",
   "Mint"
  ],
  "location": "Region",
  "geo": "",
  "images": [
   {
    "field": "Image_URL_1",
    "urlField": "Image_URL_1",
    "label": "Obverse"
   },
   {
    "field": "Image_URL_2",
    "urlField": "Image_URL_2",
    "label": "Reverse"
   }
  ],
  "date": {
   "field": "hasProductionDate",
   "label": "Date minted",
   "year": "Date minted (year)",
   "century": "Century minted"
  },
  "created": null
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
  "Image_URL_2": "Reverse image"
 },
 "views": [
  "gallery",
  "boxes",
  "table",
  "charts"
 ],
 "group": {
  "field": "Region",
  "nav": "Find Areas",
  "tab": "Areas",
  "plural": "areas",
  "one": "find area",
  "numbered": false,
  "photos": false,
  "hint": "Open a find area to see its coins.",
  "map": true
 },
 "map": {
  "center": [
   37.91658,
   22.993225
  ],
  "zoom": 17,
  "base": {
   "type": "osm"
  },
  "from": "isthmia",
  "areas": true,
  "field": "Region",
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
 "groupable": [
  "Region",
  "Period",
  "Mint",
  "Material",
  "Denomination",
  "DepositionType",
  "DepositionName",
  "Century minted",
  "NOTEBOOK"
 ],
 "keyFields": [
  "INVENTORY NUMBER",
  "CLEMENT NUMBER",
  "hasStatedAuthority",
  "Mint",
  "hasProductionDate",
  "Period",
  "Denomination",
  "Material",
  "hasObverse",
  "hasReverse",
  "hasWeight",
  "hasDiameter",
  "hasAxis",
  "Region",
  "hasFindContext",
  "ReferenceWork"
 ],
 "facetFields": [
  "Period",
  "Mint",
  "Region",
  "Material",
  "Denomination",
  "hasStatedAuthority",
  "DepositionType",
  "DepositionName",
  "NOTEBOOK",
  "StratigraphicUnit Studied?",
  "Wear",
  "SecondaryTreatment",
  "Collection"
 ],
 "linkFields": [
  "hasFindContext",
  "StratigraphicUnit"
 ],
 "sorts": [
  [
   "f:CLEMENT NUMBER",
   "Clement number"
  ],
  [
   "f:INVENTORY NUMBER",
   "Inventory number"
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
   "title",
   "Authority A–Z"
  ],
  [
   "f:Mint",
   "Mint A–Z"
  ],
  [
   "n:hasWeight",
   "Weight, lightest first"
  ],
  [
   "box",
   "Order in the spreadsheet"
  ]
 ],
 "table": {
  "cols": [
   "INVENTORY NUMBER",
   "CLEMENT NUMBER",
   "hasStatedAuthority",
   "Mint",
   "hasProductionDate",
   "Period",
   "Denomination",
   "Material",
   "hasWeight",
   "hasDiameter",
   "Region",
   "hasFindContext",
   "URI"
  ],
  "widths": {
   "INVENTORY NUMBER": 110,
   "CLEMENT NUMBER": 100,
   "hasStatedAuthority": 240,
   "Mint": 120,
   "hasProductionDate": 120,
   "Period": 140,
   "Denomination": 110,
   "Material": 80,
   "hasWeight": 80,
   "hasDiameter": 90,
   "Region": 150,
   "hasFindContext": 130
  }
 },
 "numeric": [
  {
   "label": "Weight (g)",
   "field": "hasWeight",
   "unit": "g",
   "bins": [
    [
     0.5,
     "0.5 g"
    ],
    [
     1,
     "1 g"
    ],
    [
     2,
     "2 g"
    ]
   ]
  },
  {
   "label": "Diameter (mm)",
   "field": "hasDiameter",
   "unit": "mm",
   "bins": [
    [
     1,
     "1 mm"
    ],
    [
     2,
     "2 mm"
    ],
    [
     5,
     "5 mm"
    ]
   ]
  }
 ],
 "charts": {
  "defaultX": "Period",
  "stackSeries": [
   "Period",
   "Material"
  ],
  "skip": [
   "Image_URL_1",
   "Image_URL_2",
   "Easting",
   "Northing",
   "hasObverse",
   "hasReverse",
   "ReferenceWork",
   "NOTES",
   "Published",
   "INVENTORY NUMBER",
   "CLEMENT NUMBER",
   "Notebook Page",
   "ArchivalPhoto"
  ],
  "defaults": [
   0,
   1,
   2
  ],
  "suggestions": [
   {
    "title": "Coins by period",
    "type": "bar",
    "x": "Period",
    "note": "Roman Imperial, Byzantine, Frankish, Venetian…"
   },
   {
    "title": "Coins across time",
    "type": "column",
    "x": "Date minted (year)",
    "bin": 100,
    "note": "Century each coin was minted"
   },
   {
    "title": "Where the coins were found",
    "type": "bar",
    "x": "Region",
    "top": 15,
    "note": "Find areas at Isthmia"
   },
   {
    "title": "Top mints",
    "type": "bar",
    "x": "Mint",
    "top": 15,
    "note": "Where the coins were struck"
   },
   {
    "title": "Weight vs diameter",
    "type": "scatter",
    "x": "Diameter (mm)",
    "yField": "Weight (g)",
    "series": "Period",
    "note": "Each dot is one coin; drag to select"
   },
   {
    "title": "Metal",
    "type": "donut",
    "x": "Material",
    "note": "AE (bronze) sizes, billon, silver…"
   },
   {
    "title": "Periods by find area",
    "type": "stacked",
    "x": "Region",
    "top": 10,
    "series": "Period",
    "note": "Stacked columns"
   },
   {
    "title": "Weight distribution",
    "type": "column",
    "x": "Weight (g)",
    "bin": 0.5,
    "note": "Coins per half gram"
   },
   {
    "title": "Hoards and deposits",
    "type": "donut",
    "x": "DepositionType",
    "note": "Coins found together"
   },
   {
    "title": "Average date by find area",
    "type": "bar",
    "x": "Region",
    "top": 15,
    "y": "avg",
    "yField": "Date minted (year)",
    "note": "Earlier vs later areas"
   }
  ]
 },
 "editor": {
  "defaultCols": [
   "INVENTORY NUMBER",
   "CLEMENT NUMBER",
   "hasStatedAuthority",
   "Mint",
   "hasProductionDate",
   "Period",
   "Denomination",
   "Material",
   "hasObverse",
   "hasReverse",
   "hasWeight",
   "hasDiameter",
   "hasAxis",
   "Region",
   "hasFindContext",
   "StratigraphicUnit",
   "NOTEBOOK",
   "Notebook Page",
   "ReferenceWork"
  ],
  "widths": {
   "hasStatedAuthority": 220,
   "hasObverse": 260,
   "hasReverse": 260,
   "ReferenceWork": 240,
   "hasProductionDate": 120,
   "Region": 150,
   "hasFindContext": 130,
   "StratigraphicUnit": 130
  },
  "categorical": [
   "Period",
   "Mint",
   "Region",
   "Material",
   "Denomination",
   "hasStatedAuthority",
   "DepositionType",
   "DepositionName",
   "NOTEBOOK",
   "Collection",
   "Wear",
   "SecondaryTreatment",
   "StratigraphicUnit Studied?"
  ],
  "textarea": [
   "hasObverse",
   "hasReverse",
   "ReferenceWork",
   "NOTES",
   "Published",
   "ArchivalPhoto"
  ],
  "issues": [
   "missing:Period",
   "missing:Mint",
   "missing:hasStatedAuthority",
   "missing:hasProductionDate",
   "missing:hasWeight",
   "no-image"
  ],
  "upload": false
 },
 "hub": {
  "type": "Coin",
  "area": "Region",
  "trench": "hasFindContext",
  "people": "hasStatedAuthority",
  "year": "INVENTORY NUMBER",
  "notPeopleFields": [
   "Mint"
  ],
  "search": [
   "hasStatedAuthority",
   "Mint",
   "hasObverse",
   "hasReverse"
  ],
  "only": "",
  "cut": true
 },
 "features": {
  "gallery": true,
  "boxes": true,
  "table": true,
  "charts": true,
  "map": "tab",
  "sitePhoto": true,
  "background": "light",
  "cardPair": true,
  "scaleBar": true,
  "pages": true,
  "combined": true,
  "editor": true
 },
 "adminRepo": "tregodan-msu/isthmia",
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
 },
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
   "center": [
    37.91658,
    22.993225
   ],
   "zoom": 17,
   "base": {
    "type": "osm"
   },
   "from": "isthmia",
   "areas": true,
   "field": "Region",
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
