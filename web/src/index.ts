import { serve } from "bun";
import index from "./index.html";

const port = process.env.BUN_PORT ? parseInt(process.env.BUN_PORT) : 3001;

const server = serve({
  port,
  routes: {
    // Serve index.html for all routes (SPA)
    "/*": index,
  },
  development: {
    // Enable browser hot reloading in development
    hmr: true,
    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Dev server running at http://localhost:${server.port}`);

