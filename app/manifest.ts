import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wortwerk — German Vocabulary Trainer",
    short_name: "Wortwerk",
    description: "Імпорт списків слів, AI-нормалізація, повторення й аналіз помилок з німецької.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#111111",
    orientation: "portrait",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
