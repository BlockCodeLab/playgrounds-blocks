import JoystickHandle_cpp from './files/JoystickHandle.cpp';
import JoystickHandle_h from './files/JoystickHandle.h';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'JoystickHandle.h',
        type: 'text/x-c',
        uri: JoystickHandle_h,
      },
      {
        name: 'JoystickHandle.cpp',
        type: 'text/x-c',
        uri: JoystickHandle_cpp,
      },
    ];
  }
  return [];
};
