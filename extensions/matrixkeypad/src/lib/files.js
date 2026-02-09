import matrixKeypadCppUri from './files/matrixkeypad.cpp';
import matrixKeypadHUri from './files/matrixkeypad.h';

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

  return [];
};
