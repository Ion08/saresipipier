import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sare și Piper - Restaurant Premium",
    short_name: "Sare și Piper",
    description: "Restaurant premium în Porumbeni, Chișinău",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F6F2",
    theme_color: "#1F1B18",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
