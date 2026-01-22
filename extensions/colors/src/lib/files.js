import nlcs11H from './files/nlcs11.h';
import nlcs11Cpp from './files/nlcs11.cpp';
import tcs34725H from './files/tcs34725.h';
import tcs34725Cpp from './files/tcs34725.cpp';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
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

  return [];
};
