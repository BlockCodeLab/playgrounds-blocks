import tm1650PyUri from './tm1650.py';
import decimal1650PyUri from './decimal1650.py';

export const files = (meta) => {
  if (meta.editor !== '@blockcode/gui-arduino') {
    return [
      {
        name: 'decimal1650',
        type: 'text/x-python',
        uri: decimal1650PyUri,
      },
      {
        common: true,
        name: 'tm1650',
        type: 'text/x-python',
        uri: tm1650PyUri,
      },
    ];
  }

  return [];
};
