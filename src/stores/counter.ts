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
  const instance = ref<arrayConfig>({len: 10, array: [], min: 0, max: 100, compareCount: 0,swapCount: 0})
  InitArray(instance.value)
  return { arrayConfig: instance }
})
