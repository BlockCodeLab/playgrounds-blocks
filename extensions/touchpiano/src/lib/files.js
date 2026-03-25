import touchpianoCppUri from './files/touchpiano.cpp';
import touchpianoHUri from './files/touchpiano.h';
import touchpianoPyUri from './files/touchpiano.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [
      {
        header: true,
        name: 'touchpiano.h',
        type: 'text/x-c',
        uri: touchpianoHUri,
      },
      {
        name: 'touchpiano.cpp',
        type: 'text/x-c',
        uri: touchpianoCppUri,
      },
    ];
  }

  return [
    {
      name: 'touchpiano.py',
      type: 'text/x-python',
      uri: touchpianoPyUri,
    },
  ];
};
