import ledPixelPyUrl from './files/ledpixel.py';
import ledPixelHUrl from './files/ledpixel.h';
import ledPixelCppUrl from './files/ledpixel.cpp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'ledpixel.h',
        type: 'text/x-c',
        uri: ledPixelHUrl,
      },
      {
        name: 'ledpixel.cpp',
        type: 'text/x-c',
        uri: ledPixelCppUrl,
      },
    ];
  }

  return [
    {
      common: true,
      name: 'ledpixel',
      type: 'text/x-python',
      uri: ledPixelPyUrl,
    },
  ];
};
