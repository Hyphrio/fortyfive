import { randomBetween, randomIntegerBetween, randomSeeded } from "@std/random"

function randomAngle(): number {
    // Generate 128-bit random
    const buffer = new Uint8Array(16)
    crypto.getRandomValues(buffer);
    const seed = new DataView(buffer.buffer).getBigUint64(0);

    // Seed the rng
    const prng = randomSeeded(seed);

    // 1-18000 (zeph)
    if (randomIntegerBetween(1, 18000, { prng }) === 18000) {
        return 90.000
    }

    const random = Math.round(randomBetween(0, 90, { prng }) * 1000) / 1000
    return random
}

export {
    randomAngle
}