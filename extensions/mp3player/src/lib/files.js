import GD5800SerialCppUri from './files/GD5800_Serial.cpp';
import GD5800SerialHUri from './files/GD5800_Serial.h';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'GD5800_Serial.h',
        type: 'text/x-c',
        uri: GD5800SerialHUri,
      },
      {
        name: 'GD5800_Serial.cpp',
        type: 'text/x-c',
        uri: GD5800SerialCppUri,
      },
    ];
  }

  return [];
};
