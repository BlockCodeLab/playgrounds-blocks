import dm11CppUri from './files/dm11.cpp';
import dm11HUri from './files/dm11.h';
import dm11PyUri from './files/dm11.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'dm11.h',
        type: 'text/x-c',
        uri: dm11HUri,
      },
      {
        name: 'dm11.cpp',
        type: 'text/x-c',
        uri: dm11CppUri,
      },
    ];
  }

  return [
    {
      name: 'dm11.py',
      type: 'text/x-python',
      uri: dm11PyUri,
    },
  ];
};
