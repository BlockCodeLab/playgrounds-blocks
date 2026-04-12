import matrixKeypadCppUri from './files/matrixkeypad.cpp';
import matrixKeypadHUri from './files/matrixkeypad.h';
import matrixKeypadPyUri from './files/matrixkeypad.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'matrixkeypad.h',
        type: 'text/x-c',
        uri: matrixKeypadHUri,
      },
      {
        name: 'matrixkeypad.cpp',
        type: 'text/x-c',
        uri: matrixKeypadCppUri,
      },
    ];
  }

  return [
    {
      name: 'matrixkeypad.py',
      type: 'text/x-python',
      uri: matrixKeypadPyUri,
    },
  ];
};
