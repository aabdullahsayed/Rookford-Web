# Rookford 


```
src/
├─ pages/
│  └─ Home.jsx                 Root: switches between Store and Admin (#admin)
│
├─ features/
│  ├─ store/
│  │  ├─ StoreApp.jsx          All store state + handlers, composes the pieces below
│  │  ├─ sections/             Page sections, top to bottom
│  │  │   AnnouncementBar · Navbar · MobileNav · Hero · Ticker · Collections
│  │  │   Shop · Editorial · FadeGuide · Lookbook · Craft · Journal
│  │  │   Reviews · Newsletter · Footer
│  │  ├─ overlays/             BagDrawer · QuickView · SearchOverlay · Toast · BackToTop
│  │  └─ components/           HeartIcon · Stat · LineNote
│  ├─ checkout/
│  │  └─ Checkout.jsx          3-step checkout
│  └─ admin/
│     AdminApp · AdminLogin · AdminProducts · AdminProductForm · AdminOrders
│
├─ lib/
│  ├─ api.js                   API endpoints + getJSON
│  ├─ constants.js             Shipping, payment, countries, ticker, announcements …
│  ├─ helpers.js               money, esc, store (localStorage), normalizeProduct …
│  └─ garments/                SVG garment illustration engine
│      engine.js · jeans.js · jacket.js · shirt.js · hat.js · index.js (garment())
│
└─ styles/
   ├─ index.js                 Joins all parts into `CSS` (order matters, same as original)
   └─ base · announcementNav · hero · tickerSections · collections · shop · editorial
      fade · lookbook · craft · journal · reviews · newsletter · footer · overlays
      quickView · search · toastTotop · checkout · hero3d · grain · admin · responsive
```
