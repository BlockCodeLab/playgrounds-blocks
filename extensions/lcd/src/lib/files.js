import lcdi2cPy from './lcdi2c.py';

export const files = (meta) => {
  if (meta.editor !== '@blockcode/gui-arduino') {
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
