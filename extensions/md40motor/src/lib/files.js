import md40CppUri from './files/md40.cpp';
import md40HUri from './files/md40.h';
import emCheckHUri from './files/em_check.h';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [
      {
        header: true,
        name: 'md40.h',
        type: 'text/x-c',
        uri: md40HUri,
      },
      {
        name: 'md40.cpp',
        type: 'text/x-c',
        uri: md40CppUri,
      },
      {
        name: 'em_check.h',
        type: 'text/x-c',
        uri: emCheckHUri,
      },
    ];
  }

  return [];
};
