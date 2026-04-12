import x16k33PyUri from './x16k33.py';
import decimal16k33PyUri from './decimal16k33.py';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (notArduino(meta)) {
    return [
      {
        name: 'decimal16k33',
        type: 'text/x-python',
        uri: decimal16k33PyUri,
      },
      {
        common: true,
        name: 'x16k33',
        type: 'text/x-python',
        uri: x16k33PyUri,
      },
    ];
  }

  return [];
};
