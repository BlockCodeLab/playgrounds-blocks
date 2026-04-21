import lcdi2cPy from './lcdi2c.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) return [];

  return [
    {
      name: 'lcdi2c.py',
      type: 'text/x-python',
      uri: lcdi2cPy,
    },
  ];
};
