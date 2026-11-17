import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// In development, Vite forwards /api calls to the Express server, so the
// browser only ever talks to one origin and no CORS setup is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
