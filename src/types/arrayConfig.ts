export interface arrayConfig {
    len: number
    min: number
    max: number
    array: Array<number>
    compareCount: number
    swapCount: number
    speed: number
    showNumber: boolean
    ascending: boolean
}

function getRandomInt(min: number, max: number): number {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export const InitArray = (a: arrayConfig) => {
    a.array = []
    a.compareCount = 0
    a.swapCount = 0

    const min = Math.min(a.min, a.max)
    const max = Math.max(a.min, a.max)

    for (let i = 0; i < a.len; i ++) {
        a.array.push(getRandomInt(min, max))
    }
    return a
}
