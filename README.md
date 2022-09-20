# pic2pdf_vue_demo(图片转pdf文档demo)

基于vue+webpack+element-ui+html2canvas+jspdf 实现图片转pdf文档demo，用户可在新窗口中直接下载pdf文档。


## 本地开发

```bash
# 安装依赖
npm i
npm start
```


## 配合使用node端项目

[node端项目地址](https://github.com/superZchen0701/pdf2pic_node_demo)

## TODO

1. 拖拉拽组件部分(主要业务逻辑在 src/components/componentArea.vue 和 src/components/editArea.vue 2个文件下)可以配合 [Vue-drag-resize](https://github.com/kirillmurashov/vue-drag-resize) 完成。
2. 图片转换后的pdf清晰度不够。