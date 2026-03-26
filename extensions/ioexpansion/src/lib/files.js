import ioExpansionCppUri from './files/ioexpansion.cpp';
import ioExpansionHUri from './files/ioexpansion.h';
import ioExpansionPyUri from './files/ioexpansion.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
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
