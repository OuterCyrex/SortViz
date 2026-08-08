

<template>
  <BarChart ref="sortVizRef"/>
  <el-button @click="myBubbleSort" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BarChart from './components/BarChart.vue';

const sortVizRef = ref<InstanceType<typeof BarChart>>()

async function myBubbleSort() {
    const viz = sortVizRef.value
    if (!viz) return
    
    const arr = viz.getArray()
    const n = viz.getLength()
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (await viz.less(j, j + 1)) {
                await viz.swap(j, j + 1)
            }
        }
    }
}
</script>

<style scoped></style>
