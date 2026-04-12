import touchpianoCppUri from './files/touchpiano.cpp';
import touchpianoHUri from './files/touchpiano.h';
import touchpianoPyUri from './files/touchpiano.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'touchpiano.h',
        type: 'text/x-c',
        uri: touchpianoHUri,
      },
      {
        name: 'touchpiano.cpp',
        type: 'text/x-c',
        uri: touchpianoCppUri,
      },
    ];
  }

  return [
    {
      name: 'touchpiano.py',
      type: 'text/x-python',
      uri: touchpianoPyUri,
    },
  ];
};
