import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { InitArray, type arrayConfig } from '@/types/arrayConfig'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})


export const useArrayConfigStore = defineStore('arrayConfig', () => {
  const instance = ref<arrayConfig>({len: 60, array: [], min: 1, max: 800, compareCount: 0,swapCount: 0, speed: 10, showNumber: false})
  InitArray(instance.value)
  const setLen = (len: number) => {instance.value.len = len}
  const setMin = (min: number) => {instance.value.min = min}
  const setMax = (max: number) => {instance.value.max = max}
  const setSpeed = (speed: number) => {instance.value.speed = speed}
  const setShowNumber = (showNumber: boolean) => {instance.value.showNumber = showNumber}
  return { arrayConfig: instance, setLen, setMin, setMax, setSpeed, setShowNumber }
})
