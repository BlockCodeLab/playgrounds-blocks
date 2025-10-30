import tm1637PyUri from './tm1637.py';

export const files = (meta) => {
  if (meta.editor !== '@blockcode/gui-arduino') {
    return [
      {
        common: true,
        name: 'tm1637',
        type: 'text/x-python',
        uri: tm1637PyUri,
      },
    ];
  }

  return [];
};
