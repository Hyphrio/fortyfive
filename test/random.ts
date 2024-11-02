import { assertGreaterOrEqual, assertLessOrEqual } from "@std/assert";
import { randomAngle } from "../src/random.ts";

Deno.test(function generateRandomAngles() {
    const rand = randomAngle();

    assertGreaterOrEqual(rand, 0)
    assertLessOrEqual(rand, 90)

    console.log(rand)
})