import * as seedrandom from 'seedrandom';
import * as uuid from 'uuid';

const defaultSeed = uuid.v4();

export function getRandomNumber(maxValue: number, minValue: number = 1, rng: seedrandom.prng = seedrandom(defaultSeed)) {
    const result = Math.floor(maxValue * rng()) + minValue;
    return result;
}
