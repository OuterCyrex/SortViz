export interface arrayConfig {
    len: number
    min: number
    max: number
    array: Array<number>
    compareCount: number
    swapCount: number
}

function getRandomInt(min: number, max: number): number {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export const InitArray = (a: arrayConfig) => {
    for (let i = 0; i < a.len; i ++) {
        a.array.push(getRandomInt(a.min, a.max))
    }
    return a
}