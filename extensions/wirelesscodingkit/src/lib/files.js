import wirelesskitPyUri from './wirelesskit.py';
import wirelesskitHUri from './wirelesskit.h';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [
      {
        header: true,
        name: 'wirelesskit.h',
        type: 'text/x-c',
        uri: wirelesskitHUri,
      },
    ];
  }

  return [
    {
      name: 'wirelesskit',
      type: 'text/x-python',
      uri: wirelesskitPyUri,
    },
  ];
};
