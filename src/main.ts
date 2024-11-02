import "@std/dotenv/load";

import { Application, Router } from "@oak/oak";
import { TwitchApi } from "./twitch.ts";
import { do45, getBest45, reset45 } from "./db/users.ts"

try {
  const twitchApi = TwitchApi.loadFromEnv();
  
  const router = new Router();
  const app = new Application();

  router.get("/twitch/45", async (ctx) => {
    const params = ctx.request.url.searchParams;
    const sender = params.get("sender");

    if (sender) {
      ctx.response.body = await do45(twitchApi, sender)
    }
  });

  router.get("/twitch/best45", async (ctx) => {
    ctx.response.body = await getBest45()
  })

  // router.get("/_internal/reset45", (ctx) => {
  //  const params = ctx.request.url.searchParams;
  //  const sender = params.get("sender");
  //
  //  if (sender) {
  //     reset45(twitchApi, sender)
  //  }
  // })

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen({ port: 8000 });
} catch (err) {
  console.error(err);
}
