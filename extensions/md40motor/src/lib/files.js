import md40CppUri from './files/md40.cpp';
import md40HUri from './files/md40.h';
import emCheckHUri from './files/em_check.h';
import md40PyUri from './files/md40.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
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

  return [
    {
      name: 'md40.py',
      type: 'text/x-python',
      uri: md40PyUri,
    },
  ];
};
