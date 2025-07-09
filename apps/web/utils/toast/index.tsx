import { notification } from 'antd'
import './style.scss'

type NotificationType = 'success' | 'info' | 'error' | 'warning'

export const openToast = (message: string | Error['message'], type: NotificationType = 'success') => {
  notification.open({
    type,
    message,
    placement: 'top',
  })
}
