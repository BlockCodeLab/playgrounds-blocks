import { Text } from '@blockcode/core';

const isArduino = (meta) => meta.editor === '@blockcode/gui-arduino';
const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

export const blocks = (meta) => [
  {
    id: 'activeBuzzer',
    text: (
      <Text
        id="blocks.buzzer.activeBuzzer"
        defaultMessage="[STATE] pin [PIN] active buzzer"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'iotPwmPins' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      STATE: {
        type: 'integer',
        inputMode: true,
        defaultValue: '1',
        menu: [
          [
            <Text
              id="blocks.buzzer.state.on"
              defaultMessage="on"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.buzzer.state.off"
              defaultMessage="off"
            />,
            '0',
          ],
        ],
      },
    },
    ino(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, OUTPUT);`;
      const code = `digitalWrite(${pin}, ${state == 1 ? 'HIGH' : 'LOW'});\n`;
      return code;
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_[pinName] = `${pinName} = Pin(${pin}, Pin.OUT)`;
      const code = `${pinName}.value(${state})\n`;
      return code;
    },
  },
  '---',
  {
    id: 'passiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.passiveBuzzer"
        defaultMessage="pin [PIN] passive buzzer play note [NOTE] for [BEAT] beats"
      />
    ),
    inputs: {
      PIN: isArduino(meta)
        ? { menu: 'arduinoPwmPins' }
        : isIotBit(meta)
          ? { menu: 'iotPwmPins' }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
      NOTE: {
        type: 'note',
        defaultValue: '60',
      },
      BEAT: {
        type: 'integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      const note = this.valueToCode(block, 'NOTE', this.ORDER_NONE);
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const pinName = `_tone${pin}`;
      this.definitions_['include_tone'] = '#include "tone.h"';
      this.definitions_['variable_tone'] = `Tone ${pinName}(${pin});`;
      const code = `${pinName}.play(${note}":${beat}");\n`;
      return code;
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const note = this.valueToCode(block, 'NOTE', this.ORDER_NONE);
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const pinName = `_tone${pin}`;
      this.definitions_['import_pin'] = 'import buzzer';
      this.definitions_['variable_tone'] = `${pinName} = buzzer.Tone(${pin})`;
      const code = `${pinName}.play(${note}":${beat}")\n`;
      return code;
    },
  },
  {
    id: 'playPassiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.playPassiveBuzzer"
        defaultMessage="pin [PIN] passive buzzer play [MUSIC]"
      />
    ),
    inputs: {
      PIN: isArduino(meta)
        ? { menu: 'arduinoPwmPins' }
        : isIotBit(meta)
          ? { menu: 'iotPwmPins' }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
      MUSIC: {
        menu: 'music',
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      const music = block.getFieldValue('MUSIC');
      const pinName = `_tone${pin}`;
      this.definitions_['include_tone'] = '#include "tone.h"';
      this.definitions_['include_tone_music'] = '#include "music.h"';
      this.definitions_['variable_tone'] = `Tone ${pinName}(${pin});`;
      const code = `${pinName}.play(${music.toUpperCase()});\n`;
      return code;
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const music = block.getFieldValue('MUSIC');
      const pinName = `_tone${pin}`;
      this.definitions_['import_pin'] = 'import buzzer';
      this.definitions_['variable_tone'] = `${pinName} = buzzer.Tone(${pin})`;
      const code = `await ${pinName}.aplay(buzzer.${music.toUpperCase()})\n`;
      return code;
    },
  },
  {
    id: 'stopPassiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.stopPassiveBuzzer"
        defaultMessage="stop pin [PIN] passive buzzer"
      />
    ),
    inputs: {
      PIN: isArduino(meta)
        ? { menu: 'arduinoPwmPins' }
        : isIotBit(meta)
          ? { menu: 'iotPwmPins' }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      const pinName = `_tone${pin}`;
      this.definitions_['include_tone'] = '#include "tone.h"';
      this.definitions_['variable_tone'] = `Tone ${pinName}(${pin});`;
      return `${pinName}.stop();\n`;
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `_tone${pin}`;
      this.definitions_['import_pin'] = 'import buzzer';
      this.definitions_['variable_tone'] = `${pinName} = buzzer.Tone(${pin})`;
      return `${pinName}.stop()\n`;
    },
  },
];

export const menus = {
  arduinoPwmPins: {
    // Arduino UNO/Nano PWM 写引脚
    items: [
      ['3', '3'],
      ['5', '5'],
      ['6', '6'],
      ['9', '9'],
      ['10', '10'],
      ['11', '11'],
    ],
  },
  iotPwmPins: {
    items: [
      ['P0', '33'],
      ['P1', '32'],
      // ['P2', '35'],
      // ['P3', '34'],
      // ['P4', '39'],
      ['P5', '0'],
      ['P6', '16'],
      ['P7', '17'],
      ['P8', '26'],
      ['P9', '25'],
      // ['P10', '36'],
      ['P11', '2'],
      // ['P12', ''],
      ['P13', '18'],
      ['P14', '19'],
      ['P15', '21'],
      ['P16', '5'],
      ['P19', '22'],
      ['P20', '23'],
      ['P23', '27'],
      ['P24', '14'],
      ['P25', '12'],
      ['P26', '13'],
      ['P27', '15'],
      ['P28', '4'],
    ],
  },
  music: {
    type: 'string',
    defaultValue: 'dadadadum',
    items: [
      [
        <Text
          id="blocks.buzzer.music.dadadadum"
          defaultMessage="dadadadum"
        />,
        'dadadadum',
      ],
      [
        <Text
          id="blocks.buzzer.music.entertainer"
          defaultMessage="entertainer"
        />,
        'entertainer',
      ],
      [
        <Text
          id="blocks.buzzer.music.prelude"
          defaultMessage="prelude"
        />,
        'prelude',
      ],
      [
        <Text
          id="blocks.buzzer.music.ode"
          defaultMessage="ode"
        />,
        'ode',
      ],
      [
        <Text
          id="blocks.buzzer.music.nyan"
          defaultMessage="nyan"
        />,
        'nyan',
      ],
      [
        <Text
          id="blocks.buzzer.music.ringtone"
          defaultMessage="ringtone"
        />,
        'ringtone',
      ],
      [
        <Text
          id="blocks.buzzer.music.funk"
          defaultMessage="funk"
        />,
        'funk',
      ],
      [
        <Text
          id="blocks.buzzer.music.blues"
          defaultMessage="blues"
        />,
        'blues',
      ],
      [
        <Text
          id="blocks.buzzer.music.birthday"
          defaultMessage="birthday"
        />,
        'birthday',
      ],
      [
        <Text
          id="blocks.buzzer.music.wedding"
          defaultMessage="wedding"
        />,
        'wedding',
      ],
      [
        <Text
          id="blocks.buzzer.music.funeral"
          defaultMessage="funeral"
        />,
        'funeral',
      ],
      [
        <Text
          id="blocks.buzzer.music.punchline"
          defaultMessage="punchline"
        />,
        'punchline',
      ],
      [
        <Text
          id="blocks.buzzer.music.python"
          defaultMessage="python"
        />,
        'python',
      ],
      [
        <Text
          id="blocks.buzzer.music.baddy"
          defaultMessage="baddy"
        />,
        'baddy',
      ],
      [
        <Text
          id="blocks.buzzer.music.chase"
          defaultMessage="chase"
        />,
        'chase',
      ],
      [
        <Text
          id="blocks.buzzer.music.baDing"
          defaultMessage="ba ding"
        />,
        'ba ding',
      ],
      [
        <Text
          id="blocks.buzzer.music.wawawawaa"
          defaultMessage="wawawawaa"
        />,
        'wawawawaa',
      ],
      [
        <Text
          id="blocks.buzzer.music.jumpUp"
          defaultMessage="jump up"
        />,
        'jump up',
      ],
      [
        <Text
          id="blocks.buzzer.music.jumpDown"
          defaultMessage="jump down"
        />,
        'jump down',
      ],
      [
        <Text
          id="blocks.buzzer.music.powerUp"
          defaultMessage="power up"
        />,
        'power up',
      ],
      [
        <Text
          id="blocks.buzzer.music.powerDown"
          defaultMessage="power down"
        />,
        'power down',
      ],
    ],
  },
};
