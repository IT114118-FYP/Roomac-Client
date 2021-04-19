import { notification } from 'antd';

const openNotification = (type, message, description, duration=0, placement='topLeft') => {
  notification[type]({
    message: message,
    description: description,
    duration: duration,
    placement: placement,
  });
};

export { openNotification }
