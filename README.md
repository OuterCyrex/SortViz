# SortViz

一个基于 Vue 3 + Vite 的排序可视化项目。

## 项目简介

SortViz 用左右分栏的方式展示排序过程：

- 左侧是数组可视化和基础参数设置
- 右侧是 TypeScript 编辑器，可以直接编写排序逻辑
- 内置常见算法模板，支持一键填充
- 支持运行中终止，便于调试算法流程

## 核心功能

- 动态绘制数组柱状图
- 调整数组长度、最小值、最大值、速度、是否显示数值
- 在编辑器中编写 `userSort()` 排序函数
- 通过模板快速生成常见排序算法
- 运行与终止一键切换
- 提供说明弹窗，帮助用户快速上手

## 技术栈

- Vue 3
- Vite
- TypeScript
- Pinia
- Element Plus
- Monaco Editor
- Tailwind CSS 4

## 排序函数写法

编辑器中的代码需要导出一个 `userSort` 异步函数：

```ts
async function userSort() {
  const n = getLength()

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!await less(j, j + 1)) {
        await swap(j, j + 1)
      }
    }
  }
}
```

可用 API：

- `await less(i, j)`：比较两个下标
- `await swap(i, j)`：交换两个下标
- `getLength()`：获取数组长度
- `getArray()`：获取当前数组

## 项目启动

```bash
npm install
npm run dev
```

## 常用命令

```bash
npm run build
npm run preview
npm run lint
```

## 说明

- 右上角设置按钮可选择常见算法模板
- 右上角说明按钮可查看函数编写方式
- 当前项目适合用于教学、演示和自定义排序算法实验
