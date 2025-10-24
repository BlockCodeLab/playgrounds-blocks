import toneHUri from './ino/tone.h';
import toneCppUri from './ino/tone.cpp';
import musicHUri from './ino/music.h';
import buzzerPyUri from './mpy/buzzer.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
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

  if (meta.editor === '@blockcode/gui-esp32') {
    return [
      {
        common: true,
        name: 'buzzer',
        type: 'text/x-python',
        uri: buzzerPyUri,
      },
    ];
  }

  return [];
};
