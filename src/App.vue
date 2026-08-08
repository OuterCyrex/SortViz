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
        <div class="flex items-center gap-2">
          <el-button :icon="QuestionFilled" circle @click="helpDialogVisible = true" />
          <el-button :icon="Setting" circle @click="templateDialogVisible = true" />
        </div>
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
        <el-button
          :type="isSorting ? 'danger' : 'primary'"
          @click="handleToggleSort"
        >
          {{ isSorting ? '终止' : '运行' }}
        </el-button>
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

  <el-dialog v-model="helpDialogVisible" title="如何编写排序函数" width="760px">
    <el-space direction="vertical" alignment="start" :size="12" class="w-full">
      <el-alert
        title="编辑器里的代码必须导出一个名为 userSort 的异步函数"
        type="info"
        :closable="false"
        show-icon
      />

      <el-card shadow="never" class="w-full">
        <template #header>可用 API</template>
        <ul class="list-disc pl-5 space-y-2 text-sm">
          <li><code>await less(i, j)</code>：比较两个下标，返回是否需要继续当前顺序。</li>
          <li><code>await swap(i, j)</code>：交换两个下标的元素。</li>
          <li><code>getLength()</code>：获取数组长度。</li>
          <li><code>getArray()</code>：获取当前数组值，通常只读使用。</li>
        </ul>
      </el-card>

      <el-card shadow="never" class="w-full">
        <template #header>最小示例</template>
        <pre class="whitespace-pre-wrap text-sm leading-6"><code>async function userSort() {
  const n = getLength()
  for (let i = 0; i &lt; n - 1; i++) {
    for (let j = 0; j &lt; n - i - 1; j++) {
      if (!await less(j, j + 1)) {
        await swap(j, j + 1)
      }
    }
  }
}</code></pre>
      </el-card>
    </el-space>

    <template #footer>
      <el-button type="primary" @click="helpDialogVisible = false">知道了</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { QuestionFilled, RefreshRight, Setting, VideoPlay } from '@element-plus/icons-vue'
import { CodeEditor } from 'monaco-editor-vue3'
import BarChart from './components/BarChart.vue'
import { useArrayConfigStore } from './stores/counter'
import { algorithmTemplates, defaultAlgorithmTemplate, getAlgorithmTemplate } from './data/algorithmTemplates'

const sortVizRef = ref<InstanceType<typeof BarChart>>()
const arrayStore = useArrayConfigStore()
const isSorting = ref(false)
const templateDialogVisible = ref(false)
const helpDialogVisible = ref(false)
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

async function handleToggleSort() {
  if (isSorting.value) {
    arrayStore.requestStopRun()
    return
  }

  const viz = sortVizRef.value
  if (!viz) return

  isSorting.value = true
  arrayStore.clearStopRequested()
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
  } catch (error) {
    if (!(error instanceof Error && error.message === 'stopped')) {
      alert('请确保模板或代码里导出了 userSort 函数')
    }
  } finally {
    isSorting.value = false
    arrayStore.clearStopRequested()
  }
}
</script>
