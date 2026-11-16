

/* ====================================================================
   BACKEND
   ==================================================================== */
export const API = {
  products: "/api/products",
  reviews: "/api/reviews",
  journal: "/api/journal",
  orders: "/api/orders",
  adminLogin: "/api/admin/login",
};

export async function getJSON(url, fallback) {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    return fallback;
  } catch {
    return fallback;
  }
}
