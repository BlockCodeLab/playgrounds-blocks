import ledPixelPyUrl from './files/ledpixel.py';
import ledPixelHUrl from './files/ledpixel.h';
import ledPixelTppUrl from './files/ledpixel.tpp';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [
      {
        header: true,
        name: 'ledpixel.h',
        type: 'text/x-c',
        uri: ledPixelHUrl,
      },
      {
        name: 'ledpixel.tpp',
        type: 'text/x-c',
        uri: ledPixelTppUrl,
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
