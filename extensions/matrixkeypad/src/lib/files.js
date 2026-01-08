import matrixKeypadCppUri from './ino/matrixkeypad.cpp';
import matrixKeypadHUri from './ino/matrixkeypad.h';

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
