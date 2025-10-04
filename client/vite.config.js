// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from "@tailwindcss/vite";
// import path from 'path'; 

// export default defineConfig({
//   plugins: [tailwindcss(), react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       "/stk_push": "http://localhost:5555",
//     },
//   },

// });


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import path from "path";

// export default defineConfig({
//   plugins: [tailwindcss(), react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 5173,
//     cors: true, // allow cross-origin requests (important for Google login & backend APIs)
//     proxy: {
//       "/stk_push": {
//         target: "http://localhost:5555",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/api": {
//         target: "http://localhost:5555",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/auth": {
//         target: "http://localhost:5555",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    cors: true, // Keep this for general asset serving if needed
    proxy: {
      "/stk_push": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false,
      },
    },
    // This is the crucial part for Cross-Origin-Opener-Policy
    headers: {
      // Allows the main document to retain references to same-origin popups,
      // while still isolating cross-origin popups. This is often suitable
      // for OAuth flows where a popup interacts with a third-party.
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",

      // If 'same-origin-allow-popups' still causes issues, you could
      // temporarily try 'unsafe-none' to rule out COOP as the cause entirely.
      // However, be aware that 'unsafe-none' removes security benefits.
      // 'Cross-Origin-Opener-Policy': 'unsafe-none',
    },
  },
});