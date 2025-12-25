import { Text } from '@blockcode/core';

const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';

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
      PIN: meta.boardPins
        ? { menu: meta.boardPins.pwm }
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
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
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
      PIN: meta.boardPins
        ? { menu: meta.boardPins.pwm }
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
      const pinName = `_tone_${pin}`;
      this.definitions_['include_tone'] = '#include "tone.h"';
      this.definitions_['variable_tone'] = `Tone ${pinName}(${pin});`;
      const code = `${pinName}.play(${note}":${beat}");\n`;
      return code;
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const note = this.valueToCode(block, 'NOTE', this.ORDER_NONE);
      const beat = this.valueToCode(block, 'BEAT', this.ORDER_NONE);
      const pinName = `_tone_${pin}`;
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
        defaultMessage="pin [PIN] passive buzzer play sound [MUSIC] until done"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.pwm }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      MUSIC: {
        menu: 'Music',
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      const music = block.getFieldValue('MUSIC');
      const pinName = `_tone_${pin}`;
      this.definitions_['include_tone'] = '#include "tone.h"';
      this.definitions_['include_tone_music'] = '#include "music.h"';
      this.definitions_['variable_tone'] = `Tone ${pinName}(${pin});`;
      const code = `${pinName}.play(${music});\n`;
      return code;
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const music = block.getFieldValue('MUSIC');
      const pinName = `_tone_${pin}`;
      this.definitions_['import_pin'] = 'import buzzer';
      this.definitions_['variable_tone'] = `${pinName} = buzzer.Tone(${pin})`;
      const code = `await ${pinName}.aplay(buzzer.${music})\n`;
      return code;
    },
  },
  notArduino(meta) && {
    id: 'startPassiveBuzzer',
    text: (
      <Text
        id="blocks.buzzer.startPassiveBuzzer"
        defaultMessage="pin [PIN] passive buzzer start sound [MUSIC]"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.pwm }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      MUSIC: {
        menu: 'Music',
      },
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const music = block.getFieldValue('MUSIC');
      const pinName = `_tone_${pin}`;
      this.definitions_['import_pin'] = 'import buzzer';
      this.definitions_['variable_tone'] = `${pinName} = buzzer.Tone(${pin})`;
      const code = `asyncio.create_task(${pinName}.aplay(buzzer.${music}))\n`;
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
      PIN: meta.boardPins
        ? { menu: meta.boardPins.pwm }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      const pinName = `_tone_${pin}`;
      this.definitions_['include_tone'] = '#include "tone.h"';
      this.definitions_['variable_tone'] = `Tone ${pinName}(${pin});`;
      return `${pinName}.stop();\n`;
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `_tone_${pin}`;
      this.definitions_['import_pin'] = 'import buzzer';
      this.definitions_['variable_tone'] = `${pinName} = buzzer.Tone(${pin})`;
      return `${pinName}.stop()\n`;
    },
  },
];

export const menus = {
  Music: {
    type: 'string',
    defaultValue: 'DADADADUM',
    items: [
      [
        <Text
          id="blocks.buzzer.music.dadadadum"
          defaultMessage="dadadadum"
        />,
        'DADADADUM',
      ],
      [
        <Text
          id="blocks.buzzer.music.entertainer"
          defaultMessage="entertainer"
        />,
        'ENTERTAINER',
      ],
      [
        <Text
          id="blocks.buzzer.music.prelude"
          defaultMessage="prelude"
        />,
        'PRELUDE',
      ],
      [
        <Text
          id="blocks.buzzer.music.ode"
          defaultMessage="ode"
        />,
        'ODE',
      ],
      [
        <Text
          id="blocks.buzzer.music.nyan"
          defaultMessage="nyan"
        />,
        'NYAN',
      ],
      [
        <Text
          id="blocks.buzzer.music.ringtone"
          defaultMessage="ringtone"
        />,
        'RINGTONE',
      ],
      [
        <Text
          id="blocks.buzzer.music.funk"
          defaultMessage="funk"
        />,
        'FUNK',
      ],
      [
        <Text
          id="blocks.buzzer.music.blues"
          defaultMessage="blues"
        />,
        'BLUES',
      ],
      [
        <Text
          id="blocks.buzzer.music.birthday"
          defaultMessage="birthday"
        />,
        'BIRTHDAY',
      ],
      [
        <Text
          id="blocks.buzzer.music.wedding"
          defaultMessage="wedding"
        />,
        'WEDDING',
      ],
      [
        <Text
          id="blocks.buzzer.music.funeral"
          defaultMessage="funeral"
        />,
        'FUNERAL',
      ],
      [
        <Text
          id="blocks.buzzer.music.punchline"
          defaultMessage="punchline"
        />,
        'PUNCHLINE',
      ],
      [
        <Text
          id="blocks.buzzer.music.python"
          defaultMessage="python"
        />,
        'PYTHON',
      ],
      [
        <Text
          id="blocks.buzzer.music.baddy"
          defaultMessage="baddy"
        />,
        'BADDY',
      ],
      [
        <Text
          id="blocks.buzzer.music.chase"
          defaultMessage="chase"
        />,
        'CHASE',
      ],
      [
        <Text
          id="blocks.buzzer.music.baDing"
          defaultMessage="ba ding"
        />,
        'BA_DING',
      ],
      [
        <Text
          id="blocks.buzzer.music.wawawawaa"
          defaultMessage="wawawawaa"
        />,
        'WAWAWAWAA',
      ],
      [
        <Text
          id="blocks.buzzer.music.jumpUp"
          defaultMessage="jump up"
        />,
        'JUMP_UP',
      ],
      [
        <Text
          id="blocks.buzzer.music.jumpDown"
          defaultMessage="jump down"
        />,
        'JUMP_DOWN',
      ],
      [
        <Text
          id="blocks.buzzer.music.powerUp"
          defaultMessage="power up"
        />,
        'POWER_UP',
      ],
      [
        <Text
          id="blocks.buzzer.music.powerDown"
          defaultMessage="power down"
        />,
        'POWER_DOWN',
      ],
    ],
  },
};
