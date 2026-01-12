import dm11CppUri from './files/dm11.cpp';
import dm11HUri from './files/dm11.h';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
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

  return [];
};
