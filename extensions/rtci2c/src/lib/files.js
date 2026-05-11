import rtci2cPy from './rtci2c.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) return [];

  return [
    {
      name: 'rtci2c.py',
      type: 'text/x-python',
      uri: rtci2cPy,
    },
  ];
};
