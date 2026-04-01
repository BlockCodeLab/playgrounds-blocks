import oledPy from './oled.py';

export const files = (meta) => {
  if (meta.editor !== '@blockcode/gui-arduino') {
    return [
      {
        name: 'oled.py',
        type: 'text/x-python',
        uri: oledPy,
      },
    ];
  }

  return [];
};
