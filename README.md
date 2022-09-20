<h1 align="center">vupload-cos</h1>

<div align="center">

[![NPM Version][npm-image]][npm-url] [![Download][download-image]][download-url]

[npm-url]:https://www.npmjs.com/package/vupload-cos
[npm-image]: https://img.shields.io/badge/npm-v1.4.x-yellow
[download-url]: https://www.npmjs.com/package/vupload-cos
[download-image]: https://img.shields.io/badge/downloads-450%2Fweek-green

File upload component based on ant design vue, which can be used to upload to COS

</div>

基于vue3和ant-design-vue的腾讯云对象存储COS上传文件组件。该组件主要服务于文件上传功能，上传文件前发送文件信息给后台，后台计算获得文件上传至COS的地址返回组件，组件再根据远程地址将文件进行推送，可用于业务无关的文件上传服务

# 安装

```bash
npm i vupload-cos -S
```

> Tip: 需要提前安装vue，ant-design-vue和axios

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

## 参数

|  参数   | 类型  |  是否必传 | 默认值 | 备注 |
|  ----  | ----  | ----  | ----  | ----  |
| `fetchUploadUrl`  | `(file: File) => Promise<UploadInfo>` | `true`  | - | - | 与后台交互获取多文件上传COS的地址和文件id，为自身的业务逻辑 |
| `acceptSuffix`  | `string[]` | `false` | `[".png", ".jpg", "ppt", "mp4", ".jpeg", ".mp3"]` | 允许的后缀 |
| `maxSize` | `number` | `false` | 524288000 | 文件最大字节数 |
| `checkFile` | `(file: File) =>  boolean` | `fase` | - | 若不传该参数，则仅对文件做大小和后缀校验；返回值`true`为通过校验，`false`为不通过校验，不会进行文件上传 |
| `notification` | `boolean` | `false` | `true` | 内置文件校验不通过时是否通过`message`进行通知 |

其中`UploadInfo`的类型如下：

```typescript
interface UploadInfo {
  url: string;
  id: string | number;
}
```
组件内置的校验包括文件大小和后缀，若要实现更多功能请使用`checkFile`函数

## 事件
|  事件名   | 类型  |  备注
|  ----  | ----  | ----  |
| `success`  | `(id: sring) => void` | 文件成功上传回调 |
| `fail`  | `(id: sring) => void` | 文件上传失败回调 |
| `error`  | `(err: Error) => void` | 文件上传过程发生的错误回调 |