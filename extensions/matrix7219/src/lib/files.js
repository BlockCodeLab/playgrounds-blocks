import fonts8x8HUri from './ino/fonts8x8.h';
import matrix7219HUri from './ino/matrix7219.h';
import matrix7219CppUri from './ino/matrix7219.cpp';
import matrix7219PyUri from './mpy/matrix7219.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'matrix7219.h',
        type: 'text/x-c',
        uri: matrix7219HUri,
      },
      {
        name: 'matrix7219.cpp',
        type: 'text/x-c',
        uri: matrix7219CppUri,
      },
      {
        name: 'fonts8x8.h',
        type: 'text/x-c',
        uri: fonts8x8HUri,
      },
    ];
  }

  return [
    {
      name: 'matrix7219',
      type: 'text/x-python',
      uri: matrix7219PyUri,
    },
  ];
};
