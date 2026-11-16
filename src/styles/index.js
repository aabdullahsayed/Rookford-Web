import base from "./base";
import announcementNav from "./announcementNav";
import hero from "./hero";
import tickerSections from "./tickerSections";
import collections from "./collections";
import shop from "./shop";
import editorial from "./editorial";
import fade from "./fade";
import lookbook from "./lookbook";
import craft from "./craft";
import journal from "./journal";
import reviews from "./reviews";
import newsletter from "./newsletter";
import footer from "./footer";
import overlays from "./overlays";
import quickView from "./quickView";
import search from "./search";
import toastTotop from "./toastTotop";
import checkout from "./checkout";
import hero3d from "./hero3d";
import grain from "./grain";
import admin from "./admin";
import responsive from "./responsive";

// Order matters: later parts override earlier ones (same order as the original stylesheet).
export const CSS = [
  base,
  announcementNav,
  hero,
  tickerSections,
  collections,
  shop,
  editorial,
  fade,
  lookbook,
  craft,
  journal,
  reviews,
  newsletter,
  footer,
  overlays,
  quickView,
  search,
  toastTotop,
  checkout,
  hero3d,
  grain,
  admin,
  responsive,
].join("");
