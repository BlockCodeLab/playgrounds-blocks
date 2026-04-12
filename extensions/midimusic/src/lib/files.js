import midiHUri from './ino/midi.h';
import midiCppUri from './ino/midi.cpp';
import midiTimbreHUri from './ino/midi_timbre.h';
import midiPyUri from './mpy/midi.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'midi.h',
        type: 'text/x-c',
        uri: midiHUri,
      },
      {
        name: 'midi.cpp',
        type: 'text/x-c',
        uri: midiCppUri,
      },
      {
        name: 'midi_timbre.h',
        type: 'text/x-c',
        uri: midiTimbreHUri,
      },
    ];
  }

  return [
    {
      name: 'midi.py',
      type: 'text/x-python',
      uri: midiPyUri,
    },
  ];
};
