import wirelesskitPyUri from './wirelesskit.py';
import wirelesskitHUri from './wirelesskit.h';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'wirelesskit.h',
        type: 'text/x-c',
        uri: wirelesskitHUri,
      },
    ];
  }

  return [
    {
      name: 'wirelesskit',
      type: 'text/x-python',
      uri: wirelesskitPyUri,
    },
  ];
};
