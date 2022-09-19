<template>
  <a-upload
    v-model:file-list="fileList"
    list-type="picture"
    multiple
    :beforeUpload="onBeforeUpload"
    :customRequest="onCustomRequest"
  >
    <slot>
      <a-button><UploadOutlined></UploadOutlined>上传</a-button>
    </slot>
  </a-upload>
</template>
<script lang="ts">
import { UploadOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, type PropType } from "vue";
import { type UploadFile, Upload } from "ant-design-vue";
import axios from "axios";
import { useMessage } from "./useMessage";

interface IFetchUploadResult {
  url: string;
  id: string | number;
}

type FetchUploadUrlFn = (
  // eslint-disable-next-line no-unused-vars
  file: UploadFile
) => Promise<IFetchUploadResult> | IFetchUploadResult;

export default defineComponent({
  name: "CosUpload",
  components: {
    UploadOutlined,
  },
  props: {
    acceptSuffix: {
      type: Array as PropType<string[]>,
      default: () => [".png", ".jpg", "ppt", "mp4", ".jpeg", ".mp3"],
    },
    maxSize: {
      type: Number,
      default: 524288000,
    },
    fetchUploadUrl: {
      type: Function as PropType<FetchUploadUrlFn>,
      required: true,
    },
    checkFile: {
      type: Function,
    },
    notification: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props, { emit }) {
    const fileList = ref<any[]>([]);
    const message = useMessage(props.notification);

    const onBeforeUpload = (file: UploadFile) => {
      const { name, size } = file;

      const suffix = "." + name.split(".")[1] || "";
      if (!props.acceptSuffix.includes(suffix)) {
        message.error("上传的文件的格式不符合要求");
        return false || Upload.LIST_IGNORE;
      }

      const maxSize = props?.maxSize || 0;
      if (maxSize < (size || 0)) {
        message.error(`上传的文件的大小超过${maxSize / 1024}KB限制`);
        return false || Upload.LIST_IGNORE;
      }

      if (props?.checkFile && !props.checkFile(file)) {
        return false || Upload.LIST_IGNORE;
      }

      return true;
    };

    const onCustomRequest = async (action: any) => {
      const { file } = action;
      const { uid } = file;
      const index = fileList.value.findIndex((file) => file.uid === uid);

      try {
        const { url, id } = await props.fetchUploadUrl(file);
        const { status } = await axios.put(url, file);

        if (status === 200) {
          emit("success", id);
          fileList.value[index].status = "done";
        } else {
          emit("fail", id);
          fileList.value[index].status = "error";
        }
      } catch (err) {
        emit("error", err);
        fileList.value[index].status = "error";
      }
    };

    return {
      fileList,
      onBeforeUpload,
      onCustomRequest,
    };
  },
});
</script>
<style scoped>
/* tile uploaded pictures */
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline [class*="-upload-list-rtl"] :deep(.ant-upload-list-item) {
  float: right;
}
</style>
