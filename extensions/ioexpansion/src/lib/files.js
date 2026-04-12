import ioExpansionCppUri from './files/ioexpansion.cpp';
import ioExpansionHUri from './files/ioexpansion.h';
import ioExpansionPyUri from './files/ioexpansion.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'io_expansion.h',
        type: 'text/x-c',
        uri: ioExpansionHUri,
      },
      {
        name: 'io_expansion.cpp',
        type: 'text/x-c',
        uri: ioExpansionCppUri,
      },
    ];
  }

  return [
    {
      name: 'ioexpansion.py',
      type: 'text/x-python',
      uri: ioExpansionPyUri,
    },
  ];
};
