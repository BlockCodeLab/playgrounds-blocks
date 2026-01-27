import ioExpansionCppUri from './files/io_expansion.cpp';
import ioExpansionHUri from './files/io_expansion.h';

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

  return [];
};
