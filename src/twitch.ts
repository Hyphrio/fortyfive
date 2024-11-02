import { AppTokenAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { getIdCache, setIdCache } from "./cache.ts";

class TwitchApi {
  private authProvider: AppTokenAuthProvider;
  private apiClient: ApiClient;

  constructor(
    clientId: string,
    clientSecret: string,
  ) {
    this.authProvider = new AppTokenAuthProvider(clientId, clientSecret);
    this.apiClient = new ApiClient({
      authProvider: this.authProvider,
    });
  }

  public static loadFromEnv(): TwitchApi {
    const clientId = Deno.env.get("TWITCH_CLIENT_ID");
    const clientSecret = Deno.env.get("TWITCH_CLIENT_SECRET");

    if (!clientId) {
      throw ("clientId not found. Set the TWITCH_CLIENT_ID environment variable.");
    }

    if (!clientSecret) {
      throw ("clientSecret not found. Set the TWITCH_CLIENT_SECRET environment variable.");
    }

    return new TwitchApi(clientId, clientSecret);
  }

  public async getHelixIdFromName(name: string): Promise<string> {
    // Check if it's in the cache first to avoid sending too many requests to Twitch (primarily for tests)
    const cache = await getIdCache(name);

    if (cache) {
      return cache.id;
    }

    // If it's not in the cache, fetch the ID from Twitch
    const helix = await this.apiClient.users.getUserByName(name);

    if (helix) {
      setIdCache(name, helix.id);
      return helix.id;
    }

    // If all else fails, reject the Promise
    return Promise.reject("Invalid user");
  }

  public async getNameFromHelixId(id: string): Promise<string> {
    const cache = await getIdCache(id);

    if (cache) {
      return cache.name;
    }

    // If it's not in the cache, fetch the ID from Twitch
    const helix = await this.apiClient.users.getUserById(id);

    if (helix) {
      setIdCache(id, helix.name);
      return helix.name;
    }

    // If all else fails, reject the Promise
    return Promise.reject("Invalid user");
  }
}

export { TwitchApi };
