class Cache {
  private key: string
  private kv?: Deno.Kv

  constructor(key: string) {
    this.key = key
  }

  public async getUser(value: UserMaybe): Promise<User | undefined> {
    return await this.initAndRun((kv) => {
      if ("id" in value) {
        const user = kv.get()
      } else {

      }
    })
  }

  public async setUser(value: User): Promise<void> {
    return await this.initAndRun(async (kv) => {
      const id = value.id;
      const name = value.name;

      await kv.atomic()
        .set(["_cache", this.key, id], )

      return;
    })
  }

  private async initAndRun<T>(run: (kv: Deno.Kv) => T | Promise<T>): Promise<T> {
    if (!this.kv) {
      this.kv = await Deno.openKv()
    }
    return await run(this.kv)
   }
}

const 
 

type User = {
  id: string,
  name: string
}

type UserMaybe = { id: string } | { name: string }