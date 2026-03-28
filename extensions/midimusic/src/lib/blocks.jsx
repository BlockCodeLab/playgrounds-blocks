import { Text } from '@blockcode/core';

const PlayNote =
  'void playNote(const uint8_t channel, const String& noteStr, const float duration, const uint8_t velocity = 127);';
const PlayNoteFunc = `void playNote(const uint8_t channel, const String& noteStr, const float duration, const uint8_t velocity) {
  if (noteStr.length() == 0) return;
  String lowerStr = noteStr;
  lowerStr.toLowerCase();

  int baseNote;
  char noteChar = lowerStr[0];
  switch(noteChar) {
    case 'c': baseNote = 0; break;
    case 'd': baseNote = 2; break;
    case 'e': baseNote = 4; break;
    case 'f': baseNote = 5; break;
    case 'g': baseNote = 7; break;
    case 'a': baseNote = 9; break;
    case 'b': baseNote = 11; break;
    default: return;
  }

  int readIndex = 1;
  if (readIndex < lowerStr.length() && lowerStr[readIndex] == '#') {
    baseNote += 1;
    readIndex++;
  }
  int octave = 0;
  if (readIndex < lowerStr.length()) {
    bool isNegative = false;
    if (lowerStr[readIndex] == '-') {
      isNegative = true;
      readIndex++;
    }
    if (readIndex < lowerStr.length() && isDigit(lowerStr[readIndex])) {
      octave = lowerStr.substring(readIndex).toInt();
      if (isNegative) {
        octave = -octave;
      }
    }
  }
  int noteNum = baseNote + 12 * (octave + 1);

  midi.NoteOn(channel, noteNum, velocity);
  delay(round(duration)-10);
  midi.NoteOff(channel, noteNum);
  delay(10);
}`;

const PlayNoteMpy = `async def play_note(channel, note_str, duration, note_velocity = 127):
  if not note_str: return

  lower_str = note_str.lower()
  note_char = lower_str[0]
  if note_char == 'c': base_note = 0
  elif note_char == 'd': base_note = 2
  elif note_char == 'e': base_note = 4
  elif note_char == 'f': base_note = 5
  elif note_char == 'g': base_note = 7
  elif note_char == 'a': base_note = 9
  elif note_char == 'b': base_note = 11
  else: return

  idx = 1
  if idx < len(lower_str) and lower_str[idx] == '#':
      base_note += 1
      idx += 1

  octave = 0
  if idx < len(lower_str):
      negative = False
      if lower_str[idx] == '-':
          negative = True
          idx += 1
      if idx < len(lower_str) and lower_str[idx].isdigit():
          start = idx
          while idx < len(lower_str) and lower_str[idx].isdigit():
              idx += 1
          octave = int(lower_str[start:idx])
          if negative:
              octave = -octave
  note_num = base_note + 12 * (octave + 1)

  _midi.note_on(channel, note_num, note_velocity)
  await asyncio.sleep_ms(round(duration)-10)
  _midi.note_off(channel, note_num)
  await asyncio.sleep_ms(10)`;

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.midimusic.init"
        defaultMessage="set MIDI pin [PIN]"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_['include_softwareserial'] = '#include <SoftwareSerial.h>';
      this.definitions_['variable_midi_serial'] = `SoftwareSerial midiSerial(-1, ${pin});`;
      this.definitions_['variable_midi_init'] = 'em::Midi midi(midiSerial);';
      this.definitions_['variable_midi_noteDuration'] = 'float kNoteDuration = 500;'; // 60000/120
      this.definitions_['setup_midi_serial'] = 'midiSerial.begin(31250);';
      this.definitions_['setup_midi_reset'] = 'midi.MidiReset();';
      this.definitions_['setup_midi_volume'] = 'midi.SetAllChannelVolume(100);';
      return '';
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_['import_uart'] = 'from machine import UART';
      this.definitions_['midi_noteDuration'] = 'note_duration = 500';
      this.definitions_['midi'] = `_midi = midi.Midi(UART(2, baudrate=31250, tx=${pin}))`;
      this.definitions_['midi_reset'] = `_midi.midi_reset()`;
      this.definitions_['midi_volume'] = `_midi.set_all_channel_volume(100)`;
      return '';
    },
  },
  '---',
  {
    id: 'playDrum',
    text: (
      <Text
        id="blocks.midimusic.playDrum"
        defaultMessage="play drum [DRUM] force [VELO]%"
      />
    ),
    inputs: {
      DRUM: {
        menu: 'Drums',
        defaultValue: 'd2',
      },
      VELO: {
        shadow: 'velocity',
        defaultValue: '80',
      },
    },
    ino(block) {
      const drum = this.valueToCode(block, 'DRUM', this.ORDER_NONE);
      const velocity = this.valueToCode(block, 'VELO', this.ORDER_NONE);

      this.definitions_['declare_playNote'] = PlayNote;
      this.definitions_['playNote'] = PlayNoteFunc;
      this.definitions_['setup_drumChannel'] = 'midi.SetChannelTimbre(9, EM_MIDI_TIMBRE_BANK_0, 0);';

      const code = `playNote(9, ${drum}, kNoteDuration, map(${velocity}, 0, 100, 0, 127));\n`;
      return code;
    },
    mpy(block) {
      const drum = this.valueToCode(block, 'DRUM', this.ORDER_NONE);
      const velocity = this.valueToCode(block, 'VELO', this.ORDER_NONE);

      this.definitions_['playNote'] = PlayNoteMpy;
      this.definitions_['midi_drumChannel'] = '_midi.set_channel_timbre(9, midi.MIDI_TIMBRE_BANK_0, 0);';

      const code = `await play_note(9, ${drum}, note_duration, round(${velocity} / 100 * 127))\n`;
      return code;
    },
  },
  {
    id: 'velocity',
    shadow: true,
    output: 'number',
    inputs: {
      VELO: {
        type: 'slider',
        defaultValue: 100,
        min: 0,
        max: 100,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('VELO') || 0;
      return [code, this.ORDER_NONE];
    },
    ino(block) {
      const code = block.getFieldValue('VELO') || 0;
      return [code, this.ORDER_NONE];
    },
  },
  {
    id: 'playNote',
    text: (
      <Text
        id="blocks.midimusic.playNote"
        defaultMessage="channel [CHAN] play note [NOTE] for [BEAT] beats"
      />
    ),
    inputs: {
      CHAN: {
        menu: 'Channels',
        defaultValue: '0',
      },
      NOTE: {
        type: 'note',
      },
      BEAT: {
        type: 'positive',
        defaultValue: '1',
      },
    },
    ino(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const note = this.valueToCode(block, 'NOTE', this.ORDER_NONE);
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const duration = `kNoteDuration * ${beat}`;

      this.definitions_['declare_playNote'] = PlayNote;
      this.definitions_['playNote'] = PlayNoteFunc;
      this.definitions_[`setup_${channel}Channel`] = `midi.SetChannelTimbre(${channel}, EM_MIDI_TIMBRE_BANK_0, 0);`;

      const code = `playNote(${channel}, ${note}, ${duration});\n`;
      return code;
    },
    mpy(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const note = this.valueToCode(block, 'NOTE', this.ORDER_NONE);
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const duration = `note_duration * ${beat}`;

      this.definitions_['playNote'] = PlayNoteMpy;
      this.definitions_[`midi_${channel}Channel`] = `_midi.set_channel_timbre(${channel}, midi.MIDI_TIMBRE_BANK_0, 0);`;

      const code = `await play_note(${channel}, ${note}, ${duration});\n`;
      return code;
    },
  },
  {
    id: 'rest',
    text: (
      <Text
        id="blocks.midimusic.rest"
        defaultMessage="channel [CHAN] rest for [BEAT] beats"
      />
    ),
    inputs: {
      BEAT: {
        type: 'positive',
        defaultValue: '1',
      },
    },
    ino(block) {
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const duration = `kNoteDuration * ${beat}`;
      const code = `delay(round(${duration}));\n`;
      return code;
    },
    mpy(block) {
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const duration = `note_duration * ${beat}`;
      const code = `await asyncio.sleep_ms(round(${duration}))\n`;
      return code;
    },
  },
  '---',
  {
    id: 'setInstrument',
    text: (
      <Text
        id="blocks.midimusic.setInstrument"
        defaultMessage="set channel [CHAN] instrument to [TIMBRE]"
      />
    ),
    inputs: {
      CHAN: {
        menu: 'Channels',
        defaultValue: '0',
      },
      TIMBRE: {
        menu: 'Timbres',
        defaultValue: '0',
      },
    },
    ino(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const timbre = this.valueToCode(block, 'TIMBRE', this.ORDER_NONE);
      const code = `midi.SetChannelTimbre(${channel}, EM_MIDI_TIMBRE_BANK_0, ${timbre});\n`;
      return code;
    },
    mpy(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const timbre = this.valueToCode(block, 'TIMBRE', this.ORDER_NONE);
      const code = `_midi.set_channel_timbre(${channel}, midi.MIDI_TIMBRE_BANK_0, ${timbre})\n`;
      return code;
    },
  },
  {
    id: 'setTimbre',
    text: (
      <Text
        id="blocks.midimusic.setTimbre"
        defaultMessage="set channel [CHAN] instrument to expanding timbre # [TIMBRE]"
      />
    ),
    inputs: {
      CHAN: {
        menu: 'Channels',
        defaultValue: '0',
      },
      TIMBRE: {
        type: 'positive_integer',
        defaultValue: '0',
      },
    },
    ino(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const timbre = this.valueToCode(block, 'TIMBRE', this.ORDER_NONE);
      const code = `midi.SetChannelTimbre(${channel}, EM_MIDI_TIMBRE_BANK_127, ${timbre});\n`;
      return code;
    },
    mpy(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const timbre = this.valueToCode(block, 'TIMBRE', this.ORDER_NONE);
      const code = `_midi.set_channel_timbre(${channel}, midi.MIDI_TIMBRE_BANK_127, ${timbre})\n`;
      return code;
    },
  },
  {
    id: 'setDrum',
    text: (
      <Text
        id="blocks.midimusic.setDrum"
        defaultMessage="set drum timbre type to [TYPE]"
      />
    ),
    inputs: {
      TYPE: {
        menu: [
          ['1', '0'],
          ['2', '16'],
          ['3', '40'],
          ['4', '48'],
          ['5', '127'],
        ],
      },
    },
    ino(block) {
      const type = block.getFieldValue('TYPE');
      const code = `midi.SetChannelTimbre(9, EM_MIDI_TIMBRE_BANK_0, ${type});\n`;
      return code;
    },
    mpy(block) {
      const type = block.getFieldValue('TYPE');
      const code = `_midi.set_channel_timbre(9, midi.MIDI_TIMBRE_BANK_0, ${type})\n`;
      return code;
    },
  },
  {
    id: 'setVolume',
    text: (
      <Text
        id="blocks.midimusic.setVolume"
        defaultMessage="set channel [CHAN] volume to [VOLUME]%"
      />
    ),
    inputs: {
      CHAN: {
        menu: 'AllChannels',
        defaultValue: '0',
      },
      VOLUME: {
        shadow: 'volume',
      },
    },
    ino(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const volumeValue = `map(${volume}, 0, 100, 0, 127)`;
      const code = `midi.SetChannelVolume(${channel}, ${volumeValue});\n`;
      return code;
    },
    mpy(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const volumeValue = `round(${volume} / 100 * 127)`;
      const code = `_midi.set_channel_volume(${channel}, ${volumeValue})\n`;
      return code;
    },
  },
  {
    id: 'setAllVolume',
    text: (
      <Text
        id="blocks.midimusic.setAllVolume"
        defaultMessage="set all volume to [VOLUME]%"
      />
    ),
    inputs: {
      VOLUME: {
        shadow: 'volume',
      },
    },
    ino(block) {
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const volumeValue = `map(${volume}, 0, 100, 0, 127)`;
      const code = `midi.SetAllChannelVolume(${volumeValue});\n`;
      return code;
    },
    mpy(block) {
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const volumeValue = `round(${volume} / 100 * 127)`;
      const code = `_midi.set_all_channel_volume(${volumeValue})\n`;
      return code;
    },
  },
  {
    id: 'setTempo',
    text: (
      <Text
        id="blocks.midimusic.setTempo"
        defaultMessage="set tempo to [TEMPO]"
      />
    ),
    inputs: {
      TEMPO: {
        type: 'positive_integer',
        defaultValue: '60',
      },
    },
    ino(block) {
      const bpm = this.valueToCode(block, 'TEMPO', this.ORDER_NONE);
      const code = `float kNoteDuration = 60000.0 / (float)${bpm};\n`;
      return code;
    },
    mpy(block) {
      const bpm = this.valueToCode(block, 'TEMPO', this.ORDER_NONE);
      const code = `note_duration = 60000 / ${bpm}\n`;
      return code;
    },
  },
  '---',
  // {
  //   id: 'setEqualizer',
  //   text: (
  //     <Text
  //       id="blocks.midimusic.setEqualizer"
  //       defaultMessage="set channel [CHAN] equalizer [NAME] to [VALUE]"
  //     />
  //   ),
  //   inputs: {
  //     CHAN: {
  //       menu: 'AllChannels',
  //       defaultValue: '0',
  //     },
  //     NAME: {
  //       menu: 'Equalizer',
  //     },
  //     VALUE: {
  //       shadow: 'equalizer',
  //     },
  //   },
  // },
  {
    id: 'setReverberation',
    text: (
      <Text
        id="blocks.midimusic.setReverberation"
        defaultMessage="set channel [CHAN] reverberation [TYPE] volume to [VOLUME]% delay feedback [FEEDBACK]%"
      />
    ),
    inputs: {
      CHAN: {
        menu: 'AllChannels',
        defaultValue: '0',
      },
      TYPE: {
        menu: 'Reverberation',
      },
      VOLUME: {
        shadow: 'volume',
      },
      FEEDBACK: {
        shadow: 'feedback',
      },
    },
    ino(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const feedback = this.valueToCode(block, 'FEEDBACK', this.ORDER_NONE);
      const type = block.getFieldValue('TYPE');
      const volumeValue = `map(${volume}, 0, 100, 0, 127)`;
      const feedbackValue = `map(${feedback}, 0, 100, 0, 127)`;
      const code = `midi.SetReverberation(${channel}, ${type}, ${volumeValue}, ${feedbackValue});\n`;
      return code;
    },
    mpy(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const feedback = this.valueToCode(block, 'FEEDBACK', this.ORDER_NONE);
      const type = block.getFieldValue('TYPE');
      const volumeValue = `round(${volume} / 100 * 127)`;
      const feedbackValue = `round(${feedback} / 100 * 127)`;
      const code = `_midi.set_reverberation(${channel}, ${type}, ${volumeValue}, ${feedbackValue})\n`;
      return code;
    },
  },
  {
    id: 'setChorus',
    text: (
      <Text
        id="blocks.midimusic.setChorus"
        defaultMessage="set channel [CHAN] chorus [TYPE] volume to [VOLUME]% delay [DELAY] ms"
      />
    ),
    inputs: {
      CHAN: {
        menu: 'AllChannels',
        defaultValue: '0',
      },
      TYPE: {
        menu: 'Chorus',
      },
      VOLUME: {
        shadow: 'volume',
      },
      DELAY: {
        type: 'positive_integer',
        defaultValue: '5',
      },
    },
    ino(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const delay = this.valueToCode(block, 'DELAY', this.ORDER_NONE);
      const type = block.getFieldValue('TYPE');
      const volumeValue = `map(${volume}, 0, 100, 0, 127)`;
      const code = `midi.SetChorus(${channel}, ${type}, ${volumeValue}, 0, ${delay});\n`;
      return code;
    },
    mpy(block) {
      const channel = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
      const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
      const delay = this.valueToCode(block, 'DELAY', this.ORDER_NONE);
      const type = block.getFieldValue('TYPE');
      const volumeValue = `round(${volume} / 100 * 127)`;
      const code = `_midi.set_chorus(${channel}, ${type}, ${volumeValue}, 0, ${delay})\n`;
      return code;
    },
  },
  {
    id: 'reset',
    text: (
      <Text
        id="blocks.midimusic.reset"
        defaultMessage="reset"
      />
    ),
    ino(block) {
      return 'midi.MidiReset();\n';
    },
    mpy(block) {
      return '_midi.midi_reset()\n';
    },
  },
  {
    id: 'volume',
    shadow: true,
    output: 'number',
    inputs: {
      VOLUME: {
        type: 'slider',
        defaultValue: 80,
        min: 0,
        max: 100,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('VOLUME') || 0;
      return [code, this.ORDER_NONE];
    },
    ino(block) {
      const code = block.getFieldValue('VOLUME') || 0;
      return [code, this.ORDER_NONE];
    },
  },
  {
    id: 'feedback',
    shadow: true,
    output: 'number',
    inputs: {
      FEEDBACK: {
        type: 'slider',
        defaultValue: 50,
        min: 0,
        max: 100,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('FEEDBACK') || 0;
      return [code, this.ORDER_NONE];
    },
    ino(block) {
      const code = block.getFieldValue('FEEDBACK') || 0;
      return [code, this.ORDER_NONE];
    },
  },
];

export const menus = {
  Beats: {
    items: [4, 8],
  },
  Channels: {
    inputMode: true,
    type: 'integer',
    items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
  },
  AllChannels: {
    inputMode: true,
    type: 'integer',
    items: [
      ['0', 0],
      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['4', 4],
      ['5', 5],
      ['6', 6],
      ['7', 7],
      ['8', 8],
      [
        <Text
          id="blocks.midimusic.drum"
          defaultMessage="9 (Drum)"
        />,
        9,
      ],
      ['10', 10],
      ['11', 11],
      ['12', 12],
      ['13', 13],
      ['14', 14],
      ['15', 15],
    ],
  },
  Drums: {
    inputMode: true,
    type: 'string',
    items: [
      [
        <Text
          id="blocks.midimusic.drumd2"
          defaultMessage="d2 Snare Drum"
        />,
        'd2',
      ],
      [
        <Text
          id="blocks.midimusic.druma2"
          defaultMessage="a2 Bass Drum"
        />,
        'a2',
      ],
      [
        <Text
          id="blocks.midimusic.drumcS2"
          defaultMessage="c#2 Side Strike"
        />,
        'c#2',
      ],
      [
        <Text
          id="blocks.midimusic.drumcS3"
          defaultMessage="c#3 Crash Cymbal"
        />,
        'c#3',
      ],
      [
        <Text
          id="blocks.midimusic.drumgS2"
          defaultMessage="g#2 Open Hi-Hat"
        />,
        'g#2',
      ],
      [
        <Text
          id="blocks.midimusic.drumfS2"
          defaultMessage="f#2 Closed Hi-Hat"
        />,
        'f#2',
      ],
      [
        <Text
          id="blocks.midimusic.drumfS3"
          defaultMessage="f#3 Tambourine"
        />,
        'f#3',
      ],
      [
        <Text
          id="blocks.midimusic.drumdS2"
          defaultMessage="d#2 Hand Clap"
        />,
        'd#2',
      ],
      [
        <Text
          id="blocks.midimusic.drumdS5"
          defaultMessage="d#5 Claves"
        />,
        'd#5',
      ],
      [
        <Text
          id="blocks.midimusic.drumf5"
          defaultMessage="f5 Wood Block"
        />,
        'f5',
      ],
      [
        <Text
          id="blocks.midimusic.drumgS3"
          defaultMessage="g#3 Cowbell"
        />,
        'g#3',
      ],
      [
        <Text
          id="blocks.midimusic.druma5"
          defaultMessage="a5 Triangle"
        />,
        'a5',
      ],
      [
        <Text
          id="blocks.midimusic.drumc4"
          defaultMessage="c4 Bongo"
        />,
        'c4',
      ],
      [
        <Text
          id="blocks.midimusic.drumdS4"
          defaultMessage="d#4 Conga"
        />,
        'd#4',
      ],
      [
        <Text
          id="blocks.midimusic.druma4"
          defaultMessage="a4 Cabasa"
        />,
        'a4',
      ],
      [
        <Text
          id="blocks.midimusic.drumcS5"
          defaultMessage="c#5 Guiro"
        />,
        'c#5',
      ],
      [
        <Text
          id="blocks.midimusic.drumaS3"
          defaultMessage="a#3 Vibraslap"
        />,
        'a#3',
      ],
      [
        <Text
          id="blocks.midimusic.drumaS4"
          defaultMessage="a#4 Maracas"
        />,
        'a#4',
      ],
    ],
  },
  Timbres: {
    inputMode: true,
    type: 'number',
    items: [
      [
        <Text
          id="blocks.midimusic.timbre0"
          defaultMessage="#0 Piano"
        />,
        '0',
      ],
      [
        <Text
          id="blocks.midimusic.timbre2"
          defaultMessage="#2 Electric Piano"
        />,
        '2',
      ],
      [
        <Text
          id="blocks.midimusic.timbre10"
          defaultMessage="#10 Music Box"
        />,
        '10',
      ],
      [
        <Text
          id="blocks.midimusic.timbre11"
          defaultMessage="#11 Vibraphone"
        />,
        '11',
      ],
      [
        <Text
          id="blocks.midimusic.timbre12"
          defaultMessage="#12 Marimba"
        />,
        '12',
      ],
      [
        <Text
          id="blocks.midimusic.timbre15"
          defaultMessage="#15 Dulcimer"
        />,
        '15',
      ],
      [
        <Text
          id="blocks.midimusic.timbre19"
          defaultMessage="#19 Organ"
        />,
        '19',
      ],
      [
        <Text
          id="blocks.midimusic.timbre22"
          defaultMessage="#22 Harmonica"
        />,
        '22',
      ],
      [
        <Text
          id="blocks.midimusic.timbre25"
          defaultMessage="#25 Guitar"
        />,
        '25',
      ],
      [
        <Text
          id="blocks.midimusic.timbre27"
          defaultMessage="#27 Electric Guitar"
        />,
        '27',
      ],
      [
        <Text
          id="blocks.midimusic.timbre32"
          defaultMessage="#32 Bass"
        />,
        '32',
      ],
      [
        <Text
          id="blocks.midimusic.timbre40"
          defaultMessage="#40 Violin"
        />,
        '40',
      ],
      [
        <Text
          id="blocks.midimusic.timbre42"
          defaultMessage="#42 Cello"
        />,
        '42',
      ],
      [
        <Text
          id="blocks.midimusic.timbre57"
          defaultMessage="#57 Trombone"
        />,
        '57',
      ],
      [
        <Text
          id="blocks.midimusic.timbre65"
          defaultMessage="#65 Saxophone"
        />,
        '65',
      ],
      [
        <Text
          id="blocks.midimusic.timbre71"
          defaultMessage="#71 Clarinet"
        />,
        '71',
      ],
      [
        <Text
          id="blocks.midimusic.timbre73"
          defaultMessage="#73 Flute"
        />,
        '73',
      ],
      [
        <Text
          id="blocks.midimusic.timbre79"
          defaultMessage="#79 Ocarina"
        />,
        '79',
      ],
      [
        <Text
          id="blocks.midimusic.timbre107"
          defaultMessage="#107 Zither"
        />,
        '54',
      ],
      [
        <Text
          id="blocks.midimusic.timbre111"
          defaultMessage="#111 Surnay"
        />,
        '111',
      ],
      [
        <Text
          id="blocks.midimusic.timbre114"
          defaultMessage="#114 Steel Drum"
        />,
        '114',
      ],
    ],
  },
  Reverberation: {
    items: [
      [
        <Text
          id="blocks.midimusic.reverberation0"
          defaultMessage="Room 1"
        />,
        '0',
      ],
      [
        <Text
          id="blocks.midimusic.reverberation1"
          defaultMessage="Room 2"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.midimusic.reverberation2"
          defaultMessage="Room 3"
        />,
        '2',
      ],
      [
        <Text
          id="blocks.midimusic.reverberation3"
          defaultMessage="Hall 1"
        />,
        '3',
      ],
      [
        <Text
          id="blocks.midimusic.reverberation4"
          defaultMessage="Hall 2"
        />,
        '4',
      ],
      [
        <Text
          id="blocks.midimusic.reverberation5"
          defaultMessage="Plate"
        />,
        '5',
      ],
      [
        <Text
          id="blocks.midimusic.reverberation6"
          defaultMessage="Delay"
        />,
        '6',
      ],
      [
        <Text
          id="blocks.midimusic.reverberation7"
          defaultMessage="Panning Delay"
        />,
        '7',
      ],
    ],
  },
  Chorus: {
    items: [
      [
        <Text
          id="blocks.midimusic.chorus0"
          defaultMessage="Effect 1"
        />,
        '0',
      ],
      [
        <Text
          id="blocks.midimusic.chorus1"
          defaultMessage="Effect 2"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.midimusic.chorus2"
          defaultMessage="Effect 3"
        />,
        '2',
      ],
      [
        <Text
          id="blocks.midimusic.chorus3"
          defaultMessage="Effect 4"
        />,
        '3',
      ],
      [
        <Text
          id="blocks.midimusic.chorus4"
          defaultMessage="Feedback"
        />,
        '4',
      ],
      [
        <Text
          id="blocks.midimusic.chorus5"
          defaultMessage="Flanger-style"
        />,
        '5',
      ],
      [
        <Text
          id="blocks.midimusic.chorus6"
          defaultMessage="Short Delay"
        />,
        '6',
      ],
      [
        <Text
          id="blocks.midimusic.chorus7"
          defaultMessage="Feedback Delay"
        />,
        '7',
      ],
    ],
  },
};
