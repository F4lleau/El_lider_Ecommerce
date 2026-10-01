const DEFAULT_INTERVAL_MS = 10 * 60 * 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeHealthUrl = (value) => {
  if (!value) {
    throw new Error("Configura KEEP_ALIVE_URL con la URL de healthcheck, por ejemplo https://tu-api.onrender.com/api/health");
  }

  const trimmed = value.trim().replace(/\/$/, "");
  return trimmed.endsWith("/api/health") ? trimmed : `${trimmed}/api/health`;
};

const ping = async (url) => {
  const startedAt = Date.now();
  const response = await fetch(url, {
    headers: {
      "User-Agent": "el-lider-qa-keepalive/1.0",
    },
  });

  const elapsedMs = Date.now() - startedAt;

  if (!response.ok) {
    throw new Error(`Healthcheck fallo con HTTP ${response.status} en ${elapsedMs}ms`);
  }

  console.log(`[keepalive] OK ${response.status} ${elapsedMs}ms ${new Date().toISOString()}`);
};

const main = async () => {
  const url = normalizeHealthUrl(process.env.KEEP_ALIVE_URL ?? process.env.BACKEND_URL);
  const once = process.argv.includes("--once");
  const intervalMs = Number(process.env.KEEP_ALIVE_INTERVAL_MS ?? DEFAULT_INTERVAL_MS);

  do {
    await ping(url);

    if (once) {
      return;
    }

    await sleep(intervalMs);
  } while (true);
};

main().catch((error) => {
  console.error(`[keepalive] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
