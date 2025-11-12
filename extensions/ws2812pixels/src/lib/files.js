import ledPixelPyUrl from './ledpixel.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [];
  }

  return [
    {
      name: 'ledpixel',
      type: 'text/x-python',
      uri: ledPixelPyUrl,
    },
  ];
};
