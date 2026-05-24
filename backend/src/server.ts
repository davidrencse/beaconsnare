import { createApp } from "./app";
import { ensureSeed } from "./seed";

const port = Number(process.env.PORT ?? 4000);

async function main(): Promise<void> {
  await ensureSeed();
  const app = createApp();
  app.listen(port, () => {
    console.log(`BeaconSnare backend listening on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
