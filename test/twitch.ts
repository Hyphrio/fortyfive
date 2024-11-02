import "@std/dotenv/load";

import { assertEquals } from "@std/assert/equals";
import { TwitchApi } from "../src/twitch.ts";
import { getIdCache } from "../src/cache.ts";

try {
  const twitchApi = TwitchApi.loadFromEnv();
  const id = await twitchApi.getHelixIdFromName("hypHrio");
  const me = "614811061" /** hypHrio */;

  Deno.test(function getIdTest() {
    assertEquals(id, me);
  });

  const cache = await getIdCache("hypHrio");

  Deno.test(function getFromCache() {
    assertEquals(cache?.id, me)
  })
  
} catch (err) {
  console.error(err);
  Deno.exit(1);
}
