import ledPixelPyUrl from './ledpixel.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [];
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
