import mfrc522Py from './mfrc522.py';

export const files = (meta) => {
  if (meta.editor !== '@blockcode/gui-arduino') {
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
