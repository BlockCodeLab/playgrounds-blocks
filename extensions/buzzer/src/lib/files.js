import toneHUri from './ino/tone.h';
import toneCppUri from './ino/tone.cpp';
import musicHUri from './ino/music.h';
import buzzerPyUri from './mpy/buzzer.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        name: 'tone.h',
        type: 'text/x-c',
        uri: toneHUri,
      },
      {
        name: 'tone.cpp',
        type: 'text/x-c',
        uri: toneCppUri,
      },
      {
        name: 'music.h',
        type: 'text/x-c',
        uri: musicHUri,
      },
    ];
  }

  return [
    {
      common: true,
      name: 'buzzer',
      type: 'text/x-python',
      uri: buzzerPyUri,
    },
  ];
};
