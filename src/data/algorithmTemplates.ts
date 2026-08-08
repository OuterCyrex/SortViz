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
  }
]

export const defaultAlgorithmTemplate: AlgorithmTemplate = algorithmTemplates[0]!

export const getAlgorithmTemplate = (key: string): AlgorithmTemplate =>
  algorithmTemplates.find(template => template.key === key) ?? defaultAlgorithmTemplate
