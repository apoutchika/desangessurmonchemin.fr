import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["86.75.87.207"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s3.desangessurmonchemin.fr" },
      // Ajouter ici les domaines d'images distantes si nécessaire
      // Exemple: { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
  },
};

export default nextConfig;
