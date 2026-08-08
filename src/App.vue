<template>
  <el-row class="h-screen w-screen" :gutter="0">
    <el-col :span="16" class="h-full flex flex-col">
      <div class="h-5/6 flex items-center justify-center overflow-hidden">
        <BarChart ref="sortVizRef" />
      </div>

      <div class="h-1/6 bg-[#252526]">
        <div class="mb-4 bg-gray-700 p-2 text-white">基础设置</div>
        <el-form :inline="false" label-width="72px">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="长度">
                <el-input-number v-model="lenModel" :min="2" :max="200" controls-position="right" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最小值">
                <el-input-number v-model="minModel" :min="1" :max="800" controls-position="right" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最大值">
                <el-input-number v-model="maxModel" :min="1" :max="800" controls-position="right" class="w-full" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="速度">
                <el-slider v-model="speedModel" :min="1" :max="100" :step="1" class="w-5/6" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="显示数值">
                <el-switch v-model="showNumberModel" inline-prompt active-text="开" inactive-text="关" />
              </el-form-item>
            </el-col>
            <el-col :span="8" />
          </el-row>
        </el-form>
      </div>
    </el-col>

    <el-col :span="8" class="h-full overflow-hidden bg-gray-700 flex flex-col">
      <div class="flex shrink-0 items-center justify-between p-4">
        <div class="text-lg font-semibold text-white">TypeScript 编辑器</div>
        <el-button :icon="Setting" circle @click="templateDialogVisible = true" />
      </div>

      <div class="pb-4" :style="{ height: 'calc(100vh - 128px)' }">
        <CodeEditor
          v-model:value="userCode"
          language="typescript"
          theme="vs-dark"
          height="100%"
          width="100%"
          :options="{ automaticLayout: true }"
        />
      </div>

      <div class="shrink-0 flex justify-end gap-3 border-gray-600 p-2">
        <el-button :icon="RefreshRight" :disabled="isSorting" @click="handleResetArray">重置</el-button>
        <el-button type="primary" :icon="VideoPlay" :loading="isSorting" @click="handleStartSort">运行</el-button>
      </div>
    </el-col>
  </el-row>

  <el-dialog v-model="templateDialogVisible" title="选择算法模板" width="760px">
    <el-form label-width="92px">
      <el-form-item label="模板">
        <el-select v-model="selectedTemplateKey" class="w-full">
          <el-option
            v-for="item in algorithmTemplates"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          >
            <div class="flex items-center justify-between gap-4">
              <span>{{ item.name }}</span>
              <span class="text-xs text-gray-500">{{ item.description }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="预览">
        <el-input
          :model-value="currentTemplate.code"
          type="textarea"
          :rows="16"
          readonly
          resize="none"
          class="font-mono"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="templateDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="applyTemplate">应用模板</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RefreshRight, Setting, VideoPlay } from '@element-plus/icons-vue'
import { CodeEditor } from 'monaco-editor-vue3'
import BarChart from './components/BarChart.vue'
import { useArrayConfigStore } from './stores/counter'
import { algorithmTemplates, defaultAlgorithmTemplate, getAlgorithmTemplate } from './data/algorithmTemplates'

const sortVizRef = ref<InstanceType<typeof BarChart>>()
const arrayStore = useArrayConfigStore()
const isSorting = ref(false)
const templateDialogVisible = ref(false)
const selectedTemplateKey = ref(defaultAlgorithmTemplate.key)
const currentTemplate = computed(() => getAlgorithmTemplate(selectedTemplateKey.value))
const userCode = ref(defaultAlgorithmTemplate.code)

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

const handleResetArray = () => {
  sortVizRef.value?.resetArray()
}

const applyTemplate = () => {
  userCode.value = currentTemplate.value.code
  templateDialogVisible.value = false
}

async function handleStartSort() {
  const viz = sortVizRef.value
  if (!viz || isSorting.value) return

  isSorting.value = true
  try {
    const factory = new Function(
      'less',
      'swap',
      'getLength',
      'getArray',
      `
        ${userCode.value}
        return typeof userSort === 'function' ? userSort : null;
      `,
    )

    const userSortFunc = factory(viz.less, viz.swap, viz.getLength, viz.getArray)
    if (typeof userSortFunc !== 'function') {
      throw new Error('userSort not found')
    }
    await userSortFunc()
  } catch {
    alert('请确保模板或代码里导出了 userSort 函数')
  } finally {
    isSorting.value = false
  }
}
</script>
