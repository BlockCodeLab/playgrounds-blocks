import tts20H from './files/tts20.h';
import tts20Cpp from './files/tts20.cpp';
import emCheckH from './files/em_check.h';
import tts20Py from './files/tts20.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [
      {
        header: true,
        name: 'tts20.h',
        type: 'text/x-c',
        uri: tts20H,
      },
      {
        name: 'tts20.cpp',
        type: 'text/x-c',
        uri: tts20Cpp,
      },
      {
        name: 'em_check.h',
        type: 'text/x-c',
        uri: emCheckH,
      },
    ];
  }

  return [
    {
      name: 'tts20.py',
      type: 'text/x-python',
      uri: tts20Py,
    },
  ];
};
