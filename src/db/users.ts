import { randomAngle } from "../random.ts";
import { TwitchApi } from "../twitch.ts";

const kv = await Deno.openKv();
type FortyFive = {
    value: number,
    time: number,
    difference: number,
    id?: string
}

async function do45(twitchApi: TwitchApi, user: string): Promise<string> {
    const id = await twitchApi.getHelixIdFromName(user);
    const key = ["best45"];
    const angle = randomAngle()
    const time = Date.now()
    const difference = calculateDifference(angle)

    const best: Deno.KvEntryMaybe<FortyFive> = await kv.get(key);
    console.log(angle)

    if (angle === 45) {
        reset45(twitchApi, user)
        return `${user}, perfect 45!`
    }

    if (best.value) {
        const value = best.value;
        if (normaliseNegative(difference) < normaliseNegative(value.difference)) {
            setBest45(id, {
                value: angle,
                time,
                difference,
                id,
            })
        }
    } else {
        setBest45(id, {
            value: angle,
            time,
            difference,
            id,
        })
    }

    return `${user}, ${angle}`

}

async function setBest45(id: string, fortyFive: FortyFive) {
    await kv.set(["best45", id], fortyFive)
}

async function getBest45(twitchApi: TwitchApi): Promise<string> {
    const data: Deno.KvEntryMaybe<FortyFive> = await kv.get(["best45"])
    

    if (data.value) {
        if (data.value.id) {
            const name = await twitchApi.getNameFromHelixId(data.value.id);

            return `${name}, ${data.value.value}`
        } else {
            return `<anon>, ${data.value.value}`
        }
    } else {
        return "<anon>"
    }
}

async function reset45(twitchApi: TwitchApi, user:string) {
    const id = await twitchApi.getHelixIdFromName(user);
    await kv.delete(["best45", id])
}   

function calculateDifference(angle: number): number {
    let raw: number;
    
    if (angle > 45) {
        raw = angle - 45
    } else {
        raw = (45 - angle) * -1
    }

    console.log(`Angle ${angle}, difference ${raw}`)
    return Math.round(raw * 1000) / 1000
    
}

function normaliseNegative(value: number): number {
    if (value < 0) {
        return value * -1;
    } else {
        return value
    }
}

export {
    do45,
    calculateDifference,
    getBest45,
    reset45
}