const kv = await Deno.openKv();

type IdCache = {
  name: string,
  id: string
}

async function getIdCache(name: string): Promise<IdCache | undefined> {
  const id = await kv.get(idKey(name.toLowerCase()));

  if (id) {
    return id.value as IdCache;
  } else {
    return undefined;
  }
}

async function setIdCache(name: string, id: string): Promise<void> {
  const idCache: IdCache = {
    name,
    id
  }
  await kv.atomic()
    .set(idKey(name), idCache, thirtyMins)
    .set(idKey(id), idCache, thirtyMins)
    .commit()
}

async function purgeCache(value:string) {
  
}

const idKey = (name: string) => ["idCache", name];
const thirtyMins = { expireIn: 1_800_000 };

export { getIdCache, setIdCache, type IdCache };
