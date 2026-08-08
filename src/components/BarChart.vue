<template>
    <div>
        <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
</template>

<script setup lang="ts">
import { useArrayConfigStore } from '@/stores/counter'
import { InitArray, type arrayConfig } from '@/types/arrayConfig'
import { ref, onMounted, watch } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const array = ref<arrayConfig | null>(null)
const canvasWidth = 1400
const canvasHeight = 800

const arrayStore = useArrayConfigStore()

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const draw = (highlightIndices?: number[], swapIndices?: number[]) => {
    if (!array.value) return
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const barWidth = canvasWidth / array.value.len

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    array.value.array.forEach((value, index) => {
        const x = index * barWidth
        const y = canvasHeight - value
        
        if (swapIndices?.includes(index)) {
            ctx.fillStyle = '#ff6b6b'
        } else if (highlightIndices?.includes(index)) {
            ctx.fillStyle = '#ffd93d'
        } else {
            ctx.fillStyle = '#4ecdc4'
        }
        ctx.fillRect(x, y, barWidth - 2, value)
        
        if (array.value?.showNumber) {
            ctx.fillStyle = '#333'
            ctx.font = '12px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'
            ctx.fillText(String(value), x + (barWidth - 2) / 2, y - 2)
        }
    })
}


const less = async (i: number, j: number): Promise<boolean> => {
    if (!array.value) return false
    
    const len = array.value.len
    if (i < 0 || i >= len || j < 0 || j >= len) {
        console.warn(`[less] 索引越界: i=${i}, j=${j}, 数组长度=${len}`)
        return false
    }
    
    draw([i, j])
    await sleep(array.value.speed)
    array.value.compareCount++
    if (!array.value.ascending) return (array.value.array[i] as number) > (array.value.array[j] as number )
    return (array.value.array[i] as number) < (array.value.array[j] as number )
}

const swap = async (i: number, j: number): Promise<void> => {
    if (!array.value) return
    
    const len = array.value.len
    if (i < 0 || i >= len || j < 0 || j >= len) {
        console.warn(`[swap] 索引越界: i=${i}, j=${j}, 数组长度=${len}`)
        return
    }
    
    if (i === j) {
        draw([], [i])
        await sleep(array.value.speed / 2)
        draw()
        return
    }
    
    draw([], [i, j])
    await sleep(array.value.speed)
    const temp = array.value.array[i]
    array.value.array[i] = array.value.array[j] as number
    array.value.array[j] = temp as number
    array.value.swapCount++
    draw()
    await sleep(array.value.speed / 2)
}

const resetArray = () => {
    if (arrayStore.arrayConfig) {
        array.value = InitArray(arrayStore.arrayConfig)
        draw()
    }
}

const getArray = () => array.value?.array ?? []
const getLength = () => array.value?.len ?? 0

defineExpose({
    less,
    swap,
    resetArray,
    getArray,
    getLength
})

onMounted(() => {
    array.value = InitArray(arrayStore.arrayConfig)
    draw()
})

watch(
    () => arrayStore.arrayConfig.showNumber,
    () => draw(),
)
</script>
