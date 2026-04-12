import mfrc522Py from './mfrc522.py';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (notArduino(meta)) {
    return [
      {
        name: 'mfrc522.py',
        type: 'text/x-python',
        uri: mfrc522Py,
      },
    ];
  }

  return [];
};
