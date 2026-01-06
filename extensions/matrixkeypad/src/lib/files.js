import matrixKeypadCppUri from './ino/matrix_keypad.cpp';
import matrixKeypadHUri from './ino/matrix_keypad.h';
import debouncerHUri from './ino/debouncer.h';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [
      {
        header: true,
        name: 'matrix_keypad.h',
        type: 'text/x-c',
        uri: matrixKeypadHUri,
      },
      {
        name: 'matrix_keypad.cpp',
        type: 'text/x-c',
        uri: matrixKeypadCppUri,
      },
      {
        name: 'debouncer.h',
        type: 'text/x-c',
        uri: debouncerHUri,
      },
    ];
  }

  return [];
};
