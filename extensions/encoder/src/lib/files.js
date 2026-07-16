import encoderPy from './encoder.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) return [];

  return [
    {
      header: true,
      name: 'encoder.py',
      type: 'text/x-python',
      uri: encoderPy,
    },
  ];
};
