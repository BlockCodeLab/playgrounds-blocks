import lcdi2cPy from './lcdi2c.py';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (notArduino(meta)) {
    return [
      {
        name: 'lcdi2c.py',
        type: 'text/x-python',
        uri: lcdi2cPy,
      },
    ];
  }

  return [];
};
