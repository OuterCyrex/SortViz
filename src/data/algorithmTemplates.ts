export interface AlgorithmTemplate {
  key: string
  name: string
  description: string
  code: string
}

export const algorithmTemplates: AlgorithmTemplate[] = [
  {
    key: 'straight insertion',
    name: '直接插入排序',
    description: 'Straight Insertion Sort',
    code: `async function userSort() {
      const n = getLength();
  
      for (let i = 1; i < n; i++) {
          const key = await getValue(i);
          let j = i - 1;
  
          while (j >= 0 && (await getValue(j)) > key) {
              await setValue(j + 1, await getValue(j));
              j--;
          }
  
          await setValue(j + 1, key);
      }
  }`
  },{
    key: 'binary insertion',
    name: '折半插入排序',
    description: 'Binary Insertion Sort',
    code: `async function userSort() {
      const n = getLength();
  
      for (let i = 1; i < n; i++) {
          const key = await getValue(i);
          let low = 0, high = i - 1;
  
          while (low <= high) {
              const mid = Math.floor((low + high) / 2);
              if (await getValue(mid) > key) {
                  high = mid - 1;
              } else {
                  low = mid + 1;
              }
          }
  
          for (let j = i - 1; j >= low; j--) {
              await setValue(j + 1, await getValue(j));
          }
  
          await setValue(low, key);
      }
  }`
  },{
    key: 'shell',
    name: '希尔排序',
    description: 'Shell Sort',
    code: `async function userSort() {
      const n = getLength();
      let gap = Math.floor(n / 2);
  
      while (gap > 0) {
          for (let i = gap; i < n; i++) {
              const key = await getValue(i);
              let j = i - gap;
  
              while (j >= 0 && (await getValue(j)) > key) {
                  await setValue(j + gap, await getValue(j));
                  j -= gap;
              }
              await setValue(j + gap, key);
          }
          gap = Math.floor(gap / 2);
      }
  }`
  },{
    key: 'bubble',
    name: '冒泡排序',
    description: 'Bubble Sort',
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
  },{
    key: 'comb',
    name: '梳排序',
    description: 'Comb Sort',
    code: `async function userSort() {
      const n = getLength();
      let gap = n;
      let swapped = true;
  
      while (gap > 1 || swapped) {
          if (gap > 1) {
              gap = Math.floor(gap / 1.3);
              if (gap < 1) gap = 1;
          }
          swapped = false;
  
          for (let i = 0; i + gap < n; i++) {
              if (await less(i + gap, i)) {
                  await swap(i, i + gap);
                  swapped = true;
              }
          }
      }
  }`,
  },{
    key: 'quick',
    name: '快速排序',
    description: 'Quick Sort',
    code: `async function userSort() {
      const n = getLength();
      await quickSort(0, n - 1);
  
      async function quickSort(low, high) {
          if (low >= high) return;
  
          const p = await partition(low, high);
          
          await quickSort(low, p - 1);
          await quickSort(p + 1, high);
      }
  
      async function partition(low, high) {
          const pivot = await getValue(high);
          
          let i = low - 1;
          
          for (let j = low; j < high; j++) {
              if (await getValue(j) <= pivot) {
                  i++;
                  await swap(i, j);
              }
          }
          
          await swap(i + 1, high);
          return i + 1;
      }
  }`,
  },{
    key: 'selection',
    name: '简单选择排序',
    description: 'Selection Sort',
    code: `async function userSort() {
      const n = getLength();
      for (let i = 0; i< n - 1; i ++) {
        let min = i;
        for (let j = i + 1; j < n; j ++) {
            if (await less(j, min)) min = j;
        }
        if (min != i) await swap(i, min)
      }
  }`,
  },{
    key: 'heap',
    name: '堆排序',
    description: 'Heap Sort',
    code: `async function userSort() {
      const n = getLength();
  
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
          await heapify(n, i);
      }
  
      for (let i = n - 1; i > 0; i--) {
          await swap(0, i);
          await heapify(i, 0);
      }
  }
  
  async function heapify(size, root) {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;
  
      if (left < size && (await getValue(left)) > (await getValue(largest))) {
          largest = left;
      }
  
      if (right < size && (await getValue(right)) > (await getValue(largest))) {
          largest = right;
      }
  
      if (largest !== root) {
          await swap(root, largest);
          await heapify(size, largest);
      }
  }`,
  },{
    key: 'merge',
    name: '归并排序',
    description: 'Merge Sort',
    code: `async function userSort() {
      const n = getLength();
      const temp = new Array(n);
      await mergeSort(0, n - 1, temp);
  }
  
  async function mergeSort(left, right, temp) {
      if (left >= right) return;
  
      const mid = Math.floor((left + right) / 2);
  
      await mergeSort(left, mid, temp);
      await mergeSort(mid + 1, right, temp);
  
      await merge(left, mid, right, temp);
  }
  
  async function merge(left, mid, right, temp) {
      for (let i = left; i <= right; i++) {
          temp[i] = await getValue(i);
      }
  
      let i = left;
      let j = mid + 1;
      let k = left;
  
      while (i <= mid && j <= right) {
          if (temp[i] <= temp[j]) {
              await setValue(k, temp[i]);
              i++;
          } else {
              await setValue(k, temp[j]);
              j++;
          }
          k++;
      }
  
      while (i <= mid) {
          await setValue(k, temp[i]);
          i++;
          k++;
      }
  
      while (j <= right) {
          await setValue(k, temp[j]);
          j++;
          k++;
      }
  }`,
  },{
    key: 'counting',
    name: '计数排序',
    description: 'Counting Sort',
    code: `async function userSort() {
      const n = getLength();
      let minVal = await getValue(0);
      let maxVal = await getValue(0);
      for (let i = 1; i < n; i++) {
          const val = await getValue(i);
          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
      }
  
      const range = maxVal - minVal + 1;
      const count = new Array(range).fill(0);
      const output = new Array(n);
  
      for (let i = 0; i < n; i++) {
          const val = await getValue(i);
          count[val - minVal]++;
      }
  
      for (let i = 1; i < range; i++) {
          count[i] += count[i - 1];
      }
  
      for (let i = n - 1; i >= 0; i--) {
          const val = await getValue(i);
          const idx = val - minVal;
          output[count[idx] - 1] = val;
          count[idx]--;
      }
  
      for (let i = 0; i < n; i++) {
          await setValue(i, output[i]);
      }
  }`,
  },{
    key: 'radix',
    name: '基数排序',
    description: 'Radix Sort',
    code: `async function userSort() {
      const n = getLength();
      let maxVal = await getValue(0);
      for (let i = 1; i < n; i++) {
          const val = await getValue(i);
          if (val > maxVal) maxVal = val;
      }
  
      for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
          await countingSortByDigit(exp);
      }
  
      async function countingSortByDigit(exp) {
          const output = new Array(n);
          const count = new Array(10).fill(0);
  
          for (let i = 0; i < n; i++) {
              const val = await getValue(i);
              const digit = Math.floor(val / exp) % 10;
              count[digit]++;
          }
  
          for (let i = 1; i < 10; i++) {
              count[i] += count[i - 1];
          }
  
          for (let i = n - 1; i >= 0; i--) {
              const val = await getValue(i);
              const digit = Math.floor(val / exp) % 10;
              output[count[digit] - 1] = val;
              count[digit]--;
          }
  
          for (let i = 0; i < n; i++) {
              await setValue(i, output[i]);
          }
      }
  }`,
  }
]

export const defaultAlgorithmTemplate: AlgorithmTemplate = algorithmTemplates[0]!

export const getAlgorithmTemplate = (key: string): AlgorithmTemplate =>
  algorithmTemplates.find(template => template.key === key) ?? defaultAlgorithmTemplate
