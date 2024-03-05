import { ElNotification } from 'element-plus';

export function showErrorToast(error) {
  ElNotification({
    title: error?.response?.statusText || error?.message,
    message: error.response?.data?.message,
    duration: 5000,
    type: 'error',
  });
}
