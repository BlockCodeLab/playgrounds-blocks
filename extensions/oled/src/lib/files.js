import oledPy from './oled.py';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (notArduino(meta)) {
    return [
      {
        header: true,
        name: 'oled.py',
        type: 'text/x-python',
        uri: oledPy,
      },
    ];
  }

  return [];
};
