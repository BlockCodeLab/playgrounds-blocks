import { Text } from '@blockcode/core';

const isArduino = (meta) => meta.editor === '@blockcode/gui-arduino';

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
      PIN: {
        type: 'integer',
        defaultValue: '1',
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
      const code = `digitalWrite(${pin}, ${state === '1' ? 'HIGH' : 'LOW'});\n`;
      return code;
    },
    mpy(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
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
    id: 'initPassiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.initPassiveBuzzer"
        defaultMessage="set pin [PIN] passive buzzer"
      />
    ),
    inputs: {
      PIN: isArduino(meta)
        ? { menu: 'arduinoPwmPins' }
        : {
            type: 'integer',
            defaultValue: '1',
          },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      this.definitions_['include_tone'] = '#include "tone.h"';
      this.definitions_['variable_tone'] = `Tone _tone(${pin});`;
      return '';
    },
    mpy(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_['import_pin'] = 'import buzzer';
      this.definitions_['variable_tone'] = `_tone = buzzer.Tone(${pin})`;
      return '';
    },
  },
  {
    id: 'passiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.passiveBuzzer"
        defaultMessage="passive buzzer play note [NOTE] for [BEAT] beats"
      />
    ),
    inputs: {
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
      const note = this.valueToCode(block, 'NOTE', this.ORDER_NONE);
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const code = `_tone.play(${note}":${beat}");\n`;
      return code;
    },
    mpy(block) {
      const note = this.valueToCode(block, 'NOTE', this.ORDER_NONE);
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const code = `_tone.play(${note}":${beat}")\n`;
      return code;
    },
  },
  {
    id: 'playPassiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.playPassiveBuzzer"
        defaultMessage="passive buzzer play [MUSIC]"
      />
    ),
    inputs: {
      MUSIC: {
        menu: 'music',
      },
    },
    ino(block) {
      const music = block.getFieldValue('MUSIC');
      this.definitions_['include_tone_music'] = '#include "music.h"';
      const code = `_tone.play(${music.toUpperCase()});\n`;
      return code;
    },
    mpy(block) {
      const music = block.getFieldValue('MUSIC');
      const code = `await _tone.aplay(buzzer.${music.toUpperCase()})\n`;
      return code;
    },
  },
  {
    id: 'stopPassiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.stopPassiveBuzzer"
        defaultMessage="stop passive buzzer"
      />
    ),
    ino(block) {
      return '_tone.stop();\n';
    },
    mpy(block) {
      return '_tone.stop()\n';
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
