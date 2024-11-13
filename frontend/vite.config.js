import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://0.0.0.0:8000", // Replace this with your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
