import { message } from "ant-design-vue";

export const useMessage = (isOpen = true) => {
  const emptyMsg = (msg: string) => {
    console.warn(
      `please set notification prop as true if you want to get notification: ${msg}`
    );
  };
  const emptyMesssage = {
    success: emptyMsg,
    error: emptyMsg,
    warning: emptyMsg,
  };

  return isOpen ? message : emptyMesssage;
};
