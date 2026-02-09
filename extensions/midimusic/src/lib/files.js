import midiHUri from './ino/midi.h';
import midiCppUri from './ino/midi.cpp';
import midiTimbreHUri from './ino/midi_timbre.h';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
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

  return [];
};
