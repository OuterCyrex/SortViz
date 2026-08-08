<template>
    <div ref="containerRef" class="h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>
    </div>
</template>

<script setup lang="ts">
import { useArrayConfigStore } from '@/stores/counter'
import { InitArray, type arrayConfig } from '@/types/arrayConfig'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const array = ref<arrayConfig | null>(null)
let canvasWidth = 0
let canvasHeight = 0
let resizeObserver: ResizeObserver | undefined

const arrayStore = useArrayConfigStore()

const sleep = (ms: number) => new Promise((resolve, reject) => setTimeout(() => {
    if (arrayStore.stopRequested) {
        reject(new Error('stopped'))
        return
    }
    resolve(void 0)
}, ms))

const syncCanvasSize = () => {
    const container = containerRef.value
    const canvas = canvasRef.value
    if (!container || !canvas) return

    const width = Math.max(1, Math.floor(container.clientWidth))
    const height = Math.max(1, Math.floor(container.clientHeight))
    const dpr = window.devicePixelRatio || 1

    canvasWidth = width
    canvasHeight = height
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)

    const ctx = canvas.getContext('2d')
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    draw()
}

const draw = (highlightIndices?: number[], swapIndices?: number[]) => {
    if (!array.value) return
    const canvas = canvasRef.value
    if (!canvas || canvasWidth === 0 || canvasHeight === 0) return
    const ctx = canvas.getContext('2d')!
    const barWidth = canvasWidth / array.value.len
    const range = Math.max(1, array.value.max - array.value.min)

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
    array.value.array.forEach((value, index) => {
        const x = index * barWidth
        const barHeight = Math.max(1, ((value - array.value!.min) / range) * (canvasHeight - 24))
        const y = canvasHeight - barHeight
        
        if (swapIndices?.includes(index)) {
            ctx.fillStyle = '#ff6b6b'
        } else if (highlightIndices?.includes(index)) {
            ctx.fillStyle = '#ffd93d'
        } else {
            ctx.fillStyle = '#4ecdc4'
        }
        ctx.fillRect(x, y, Math.max(1, barWidth - 2), barHeight)
        
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
    if (arrayStore.stopRequested) throw new Error('stopped')
    
    const len = array.value.len
    if (i < 0 || i >= len || j < 0 || j >= len) {
        console.warn(`[less] 索引越界: i=${i}, j=${j}, 数组长度=${len}`)
        return false
    }
    
    draw([i, j])
    await sleep(array.value.speed)
    array.value.compareCount++
    return (array.value.array[i] as number) < (array.value.array[j] as number )
}

const swap = async (i: number, j: number): Promise<void> => {
    if (!array.value) return
    if (arrayStore.stopRequested) throw new Error('stopped')
    
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
    if (arrayStore.stopRequested) throw new Error('stopped')
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
    syncCanvasSize()
    resizeObserver = new ResizeObserver(syncCanvasSize)
    if (containerRef.value) {
        resizeObserver.observe(containerRef.value)
    }
})

onUnmounted(() => {
    resizeObserver?.disconnect()
})

watch(
    () => arrayStore.arrayConfig.showNumber,
    () => draw(),
)
</script>
