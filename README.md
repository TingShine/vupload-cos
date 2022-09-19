# vupload-cos

基于vue3和ant-design-vue的腾讯云对象存储COS上传文件组件

## 使用

```vue
<template>
  <cos-upload 
    :fetch-upload-url="fetchUploadUrl" 
    @success="handleSuccessUpload"
    @fail="handleFailUpload"
  />
</template>
<script setup lang="ts">
import CosUpload from "vupload-cos";

const fetchUploadUrl = async (file: File) => {
    // 根据自身逻辑处理文件，并向后台获取cos上传的url和文件对应的id
    const { url, guid } = await getFileUploadUrl(file);

    return { url, id: guid }    // 最后必须返回url和id
};
const handleSuccessUpload = (guid: string) => {}
const handleFailUpload = (guid: string) => {}
</script>
```