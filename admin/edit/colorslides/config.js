// Written by scripts/build.py from sites/colorslides/site.json and features.json. Edit those, not this file.
window.GA_CONFIG = {
 "key": "colorslides",
 "collection": true,
 "siteTitle": "Isthmia Color Positives",
 "pageTitle": "Isthmia Color Positives — Isthmia Excavations",
 "description": "Browse the slides of the UCLA/OSU/MSU excavations at Isthmia.",
 "brand": {
  "mark": "I",
  "sub": "Isthmia Excavations · Slides"
 },
 "theme": {
  "accent": "#2f6f8f",
  "accentInk": "#245570",
  "accentSoft": "#e0edf3"
 },
 "contact": "freyjona@msu.edu",
 "searchPlaceholder": "Search caption, subject, location, slide box…",
 "exportName": "isthmia-color-positives",
 "noun": {
  "one": "slide",
  "many": "slides"
 },
 "dataUrl": "data/archive.json",
 "imageBase": "https://msuisthmiacolorpositives.s3.amazonaws.com/",
 "thumbBase": "https://msuisthmiacolorpositives.s3.amazonaws.com/optimized/400/",
 "mediumBase": "https://msuisthmiacolorpositives.s3.amazonaws.com/optimized/1600/",
 "imageFormats": [
  "avif",
  "webp"
 ],
 "hideOriginals": true,
 "thumbsReady": false,
 "permalinkPath": "colorslides",
 "uploads": {
  "signer": ""
 },
 "fields": {
  "id": "ID",
  "title": "Caption",
  "titleFallback": [
   "Subject",
   "ID"
  ],
  "caption": [
   "Location",
   "_cy"
  ],
  "boardCaption": [
   "Subject",
   "Location"
  ],
  "location": "Location",
  "geo": "",
  "images": [
   {
    "field": "File Name",
    "urlField": "Image_URL"
   }
  ],
  "date": {
   "field": "Date of Subject",
   "label": "Date of Subject",
   "year": "Date of Subject (year)",
   "century": "Date of Subject (century)"
  },
  "created": {
   "field": "Date Created",
   "label": "Year photographed",
   "decade": "Decade photographed"
  }
 },
 "labels": {
  "Image_URL": "Full-size image"
 },
 "views": [
  "gallery",
  "boxes",
  "table",
  "charts"
 ],
 "groupable": [
  "Slide Box",
  "Location",
  "Subject",
  "Creator",
  "Date digitized"
 ],
 "keyFields": [
  "Caption",
  "Subject",
  "Location",
  "Date of Subject",
  "Date Created",
  "Slide Box",
  "Creator"
 ],
 "facetFields": [
  "Slide Box",
  "Location",
  "Creator",
  "Date digitized"
 ],
 "linkFields": [
  "Location",
  "Slide Box"
 ],
 "sorts": [
  [
   "box",
   "Box order"
  ],
  [
   "f:ID",
   "ID order"
  ],
  [
   "title",
   "Title A–Z"
  ],
  [
   "subjOld",
   "Subject date, oldest"
  ],
  [
   "subjNew",
   "Subject date, newest"
  ],
  [
   "photoOld",
   "Photographed, oldest"
  ],
  [
   "photoNew",
   "Photographed, newest"
  ],
  [
   "loc",
   "Location A–Z"
  ]
 ],
 "table": {
  "cols": [
   "ID",
   "Caption",
   "Subject",
   "Location",
   "Date of Subject",
   "Date Created",
   "Slide Box",
   "Creator",
   "File Name",
   "URI"
  ],
  "widths": {
   "Caption": 227,
   "Subject": 320,
   "Location": 90,
   "Date of Subject": 90,
   "Date Created": 90,
   "Slide Box": 90,
   "Creator": 102,
   "File Name": 148,
   "ID": 150
  }
 },
 "editor": {
  "readOnly": [],
  "defaultCols": [
   "Slide Box",
   "Caption",
   "Subject",
   "Location",
   "File Name",
   "Film_Number",
   "Index_Number",
   "Georeference",
   "Date of Subject",
   "Date Created",
   "Creator",
   "Date digitized",
   "Device",
   "Digitizer 1",
   "Digitizer 2",
   "Digitizer 3",
   "Digitizer 4",
   "Medium",
   "Format",
   "Class",
   "Image_URL"
  ],
  "widths": {
   "Slide Box": 90,
   "Caption": 227,
   "Subject": 300,
   "Location": 90,
   "File Name": 148,
   "Film_Number": 90,
   "Index_Number": 90,
   "Georeference": 90,
   "Date of Subject": 90,
   "Date Created": 90,
   "Creator": 102,
   "Date digitized": 90,
   "Device": 91,
   "Digitizer 1": 90,
   "Digitizer 2": 90,
   "Digitizer 3": 105,
   "Digitizer 4": 126,
   "Medium": 98,
   "Format": 90,
   "Class": 90,
   "Image_URL": 260
  },
  "categorical": [
   "Slide Box",
   "Location",
   "Creator",
   "Date digitized",
   "Date of Subject"
  ],
  "textarea": [
   "Caption",
   "Subject"
  ],
  "issues": [
   "missing:Caption",
   "missing:Location",
   "missing:Date Created",
   "dup-file",
   "no-image"
  ],
  "upload": {
   "fields": [
    "Slide Box",
    "Location",
    "Date Created",
    "Creator",
    "Slide Box",
    "Location",
    "Creator",
    "Date digitized"
   ],
   "defaults": {
    "Device": "Fujifilm XT-4",
    "Digitizer 1": "Kailey Reed",
    "Digitizer 2": "Rebecca Sun",
    "Digitizer 3": "Morgan Manuszak",
    "Digitizer 4": "Morgan Leigh Smith",
    "Medium": "Color Positive",
    "Format": "35mm",
    "Class": "Image"
   }
  }
 },
 "hub": {
  "type": "Color slide",
  "area": "",
  "trench": "",
  "people": "",
  "year": "",
  "search": [
   "Caption",
   "Subject",
   "Slide Box"
  ],
  "only": "",
  "cut": false
 },
 "group": {
  "field": "Slide Box",
  "nav": "Slide Boxes",
  "tab": "Boxes",
  "plural": "boxes",
  "one": "box",
  "items": [
   "slide",
   "slides"
  ],
  "numbered": false,
  "photos": false,
  "hint": "Open a box to see its slides.",
  "map": false
 },
 "charts": {
  "defaultX": "Location",
  "stackSeries": [
   "Creator",
   "Date digitized"
  ],
  "defaults": [
   0,
   1,
   2
  ],
  "suggestions": [
   {
    "title": "Slides by location",
    "type": "bar",
    "x": "Location",
    "top": 15,
    "note": "Where they were taken"
   },
   {
    "title": "Subjects across time",
    "type": "column",
    "x": "Date of Subject (year)",
    "bin": 100,
    "note": "Century of the thing shown"
   },
   {
    "title": "Slides per year",
    "type": "line",
    "x": "Year photographed",
    "bin": 1,
    "note": "By year"
   },
   {
    "title": "Share by creator",
    "type": "pie",
    "x": "Creator",
    "note": "Creator"
   },
   {
    "title": "Boxes by size",
    "type": "bar",
    "x": "Slide Box",
    "top": 20,
    "sort": "value",
    "note": "Largest first"
   },
   {
    "title": "Slides by creator",
    "type": "donut",
    "x": "Creator",
    "note": "Creator"
   },
   {
    "title": "Top locations by century",
    "type": "stacked",
    "x": "Location",
    "top": 10,
    "series": "Date of Subject (century)",
    "note": "Stacked columns"
   }
  ]
 },
 "viewer": {
  "background": "light"
 },
 "features": {
  "gallery": true,
  "boxes": true,
  "table": true,
  "charts": true,
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
 "idPrefix": "CP",
 "formerIds": ""
};
