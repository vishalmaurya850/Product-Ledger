import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/ledger/",
          "/products/",
          "/customers/",
          "/reports/",
          "/overdue/",
          "/profile/",
          "/auth/",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://product-ledger.vercel.app/sitemap.xml",
  }
}
