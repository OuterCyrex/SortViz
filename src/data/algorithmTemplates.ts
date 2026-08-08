export interface AlgorithmTemplate {
  key: string
  name: string
  description: string
  code: string
}

export const algorithmTemplates: AlgorithmTemplate[] = [
  {
    key: 'bubble',
    name: 'Bubble Sort',
    description: '基础冒泡排序',
    code: `async function userSort() {
  const n = getLength()

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!await less(j, j + 1)) {
        await swap(j, j + 1)
      }
    }
  }
}`,
  },
  {
    key: 'selection',
    name: 'Selection Sort',
    description: '每轮选择最小值',
    code: `async function userSort() {
  const n = getLength()

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    for (let j = i + 1; j < n; j++) {
      if (await less(j, minIndex)) {
        minIndex = j
      }
    }

    if (minIndex !== i) {
      await swap(i, minIndex)
    }
  }
}`,
  },
  {
    key: 'insertion',
    name: 'Insertion Sort',
    description: '适合接近有序数组',
    code: `async function userSort() {
  const n = getLength()

  for (let i = 1; i < n; i++) {
    let j = i

    while (j > 0) {
      if (await less(j, j - 1)) {
        await swap(j, j - 1)
        j--
      } else {
        break
      }
    }
  }
}`,
  },
  {
    key: 'quick',
    name: 'Quick Sort',
    description: '递归分治模板',
    code: `async function partition(left: number, right: number): Promise<number> {
  const pivotIndex = right
  let storeIndex = left

  for (let i = left; i < right; i++) {
    if (await less(i, pivotIndex)) {
      if (i !== storeIndex) {
        await swap(i, storeIndex)
      }
      storeIndex++
    }
  }

  if (storeIndex !== right) {
    await swap(storeIndex, right)
  }

  return storeIndex
}

async function quickSort(left: number, right: number): Promise<void> {
  if (left >= right) return

  const pivotIndex = await partition(left, right)
  await quickSort(left, pivotIndex - 1)
  await quickSort(pivotIndex + 1, right)
}

async function userSort() {
  await quickSort(0, getLength() - 1)
}`,
  },
]

export const defaultAlgorithmTemplate: AlgorithmTemplate = algorithmTemplates[0]!

export const getAlgorithmTemplate = (key: string): AlgorithmTemplate =>
  algorithmTemplates.find(template => template.key === key) ?? defaultAlgorithmTemplate
