<template>
  <el-row class="h-screen w-screen" :gutter="0">
    <el-col :span="16" class="h-full flex flex-col">
      <div class="h-4/5 flex justify-center items-center overflow-hidden">
        <BarChart ref="sortVizRef" />
      </div>
      <div class="h-1/5">
        <el-card shadow="never" class="h-full p-4" body-style="height: 100%; padding: 16px;">
          <el-form :inline="false" label-width="72px">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="长度">
                  <el-input-number v-model="lenModel" :min="2" :max="200" controls-position="right" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最小值">
                  <el-input-number v-model="minModel" :min="0" :max="800" controls-position="right" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最大值">
                  <el-input-number v-model="maxModel" :min="0" :max="800" controls-position="right" class="w-full" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="速度">
                  <div class="flex w-5/6 items-center">
                    <el-slider v-model="speedModel" :min="1" :max="100" :step="1" />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="显示数值" class="ml-3">
                  <el-switch v-model="showNumberModel" inline-prompt active-text="开" inactive-text="关" />
                </el-form-item></el-col>
              <el-col :span="8">
                <el-form-item label="升序排序" class="ml-3">
                  <el-switch v-model="showAscending" inline-prompt active-text="开" inactive-text="关" />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="flex justify-end">
              <el-button :icon="RefreshRight" :disabled="isSorting" @click="handleResetArray">重置数组</el-button>
              <el-button type="primary" :icon="VideoPlay" :loading="isSorting" @click="handleStartSort">开始排序</el-button>
            </div>
          </el-form>
        </el-card>
      </div>
    </el-col>
    <el-col :span="8" class="h-full bg-red-400">
      <div class="h-1/2">1</div>
      <div class="h-1/2">1</div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RefreshRight, VideoPlay } from '@element-plus/icons-vue'
import BarChart from './components/BarChart.vue';
import { useArrayConfigStore } from './stores/counter'

const sortVizRef = ref<InstanceType<typeof BarChart>>()
const arrayStore = useArrayConfigStore()
const isSorting = ref(false)

const lenModel = computed({
  get: () => arrayStore.arrayConfig.len,
  set: (value: number) => arrayStore.setLen(value),
})

const minModel = computed({
  get: () => arrayStore.arrayConfig.min,
  set: (value: number) => arrayStore.setMin(value),
})

const maxModel = computed({
  get: () => arrayStore.arrayConfig.max,
  set: (value: number) => arrayStore.setMax(value),
})

const speedModel = computed({
  get: () => arrayStore.arrayConfig.speed,
  set: (value: number) => arrayStore.setSpeed(value),
})

const showNumberModel = computed({
  get: () => arrayStore.arrayConfig.showNumber,
  set: (value: boolean) => arrayStore.setShowNumber(value),
})

const showAscending = computed({
  get: () => arrayStore.arrayConfig.ascending,
  set: (value: boolean) => arrayStore.setAscending(value),
})

const handleResetArray = () => {
  sortVizRef.value?.resetArray()
}

async function handleStartSort() {
  const viz = sortVizRef.value
  if (!viz) return
  if (isSorting.value) return

  isSorting.value = true
  try {
    const n = viz.getLength()

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!await viz.less(j, j + 1)) {
          await viz.swap(j, j + 1)
        }
      }
    }
  } finally {
    isSorting.value = false
  }
}
</script>
