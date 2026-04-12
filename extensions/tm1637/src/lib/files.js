import tm1637PyUri from './tm1637.py';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (notArduino(meta)) {
    return [
      {
        name: 'tm1637',
        type: 'text/x-python',
        uri: tm1637PyUri,
      },
    ];
  }

  return [];
};
