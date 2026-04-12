import nlcs11H from './ino/nlcs11.h';
import nlcs11Cpp from './ino/nlcs11.cpp';
import tcs34725H from './ino/tcs34725.h';
import tcs34725Cpp from './ino/tcs34725.cpp';
import tcs34725Py from './mpy/tcs34725.py';
import nlcs11Py from './mpy/nlcs11.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        name: 'nlcs11.h',
        type: 'text/x-c',
        uri: nlcs11H,
      },
      {
        name: 'nlcs11.cpp',
        type: 'text/x-c',
        uri: nlcs11Cpp,
      },
      {
        name: 'tcs34725.h',
        type: 'text/x-c',
        uri: tcs34725H,
      },
      {
        name: 'tcs34725.cpp',
        type: 'text/x-c',
        uri: tcs34725Cpp,
      },
    ];
  }

  return [
    {
      common: true,
      name: 'tcs34725.py',
      type: 'text/x-python',
      uri: tcs34725Py,
    },
    {
      common: true,
      name: 'nlcs11.py',
      type: 'text/x-python',
      uri: nlcs11Py,
    },
  ];
};
