import x16k33PyUri from './x16k33.py';
import decimal16k33PyUri from './decimal16k33.py';

export const files = (meta) => {
  if (meta.editor !== '@blockcode/gui-arduino') {
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
