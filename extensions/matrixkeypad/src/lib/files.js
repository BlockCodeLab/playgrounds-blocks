import matrixKeypadCppUri from './files/matrixkeypad.cpp';
import matrixKeypadHUri from './files/matrixkeypad.h';
import matrixKeypadPyUri from './files/matrixkeypad.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
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
