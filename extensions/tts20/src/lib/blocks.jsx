import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'blockA',
    text: (
      <Text
        id="blocks.tts20.addr"
        defaultMessage="set I2C address [ADDR]"
      />
    ),
    inputs: {
      ADDR: {
        menu: [
          ['0×40', '0x40'],
          ['0×41', '0x41'],
          ['0×42', '0x42'],
          ['0×43', '0x43'],
          ['0×44', '0x44'],
          ['0×45', '0x45'],
          ['0×46', '0x46'],
          ['0×47', '0x47'],
        ],
      },
    },
    ino(block) {
      const addr = block.getFieldValue('ADDR');
      this.definitions_['variable_tts20'] = `em::Tts20 tts20(${addr});`;
      this.definitions_['setup_wire'] = 'Wire.begin();';
      this.definitions_['setup_tts20'] = `tts20.Init();`;
      return '';
    },
  },
  '---',
  {
    id: 'speech',
    text: (
      <Text
        id="blocks.tts20.speech"
        defaultMessage="speech text [STR]"
      />
    ),
    inputs: {
      STR: {
        type: 'string',
        defaultValue: '你好',
      },
    },
    ino(block) {
      const str = this.valueToCode(block, 'STR', this.ORDER_ATOMIC);
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const code = `tts20.Play(${str});\n`;
      return code;
    },
  },
  {
    id: 'stop',
    text: (
      <Text
        id="blocks.tts20.stop"
        defaultMessage="stop"
      />
    ),
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const code = 'tts20.Stop();\n';
      return code;
    },
  },
  {
    id: 'done',
    text: (
      <Text
        id="blocks.tts20.done"
        defaultMessage="speech done?"
      />
    ),
    output: 'boolean',
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const code = '!tts20.IsBusy()';
      return [code];
    },
  },
  '---',
  {
    id: 'control',
    text: (
      <Text
        id="blocks.tts20.control"
        defaultMessage="[STR] speech [CTRL] of [NUM]"
      />
    ),
    output: 'string',
    inputs: {
      STR: {
        type: 'string',
        defaultValue: '你好',
      },
      CTRL: {
        menu: [
          [
            <Text
              id="blocks.tts20.controlVolume"
              defaultMessage="volume"
            />,
            'volume',
          ],
          [
            <Text
              id="blocks.tts20.controlSpeed"
              defaultMessage="speed"
            />,
            'speed',
          ],
          [
            <Text
              id="blocks.tts20.controlTone"
              defaultMessage="tone"
            />,
            'tone',
          ],
        ],
      },
      NUM: {
        defaultValue: '5',
        menu: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      },
    },
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const str = this.valueToCode(block, 'STR', this.ORDER_ATOMIC);
      const ctrl = block.getFieldValue('CTRL');
      const num = block.getFieldValue('NUM');
      let code = '';
      if (/^".*"$/.test(str)) {
        code += str;
      } else {
        code += `String(${str})+`;
      }
      code += this.quote_(`[${ctrl}${num}]`);
      return [code];
    },
  },
  {
    id: 'number',
    text: (
      <Text
        id="blocks.tts20.number"
        defaultMessage="[NUM] speech as [CTRL]"
      />
    ),
    output: 'string',
    inputs: {
      NUM: {
        type: 'number',
        defaultValue: 12345,
      },
      CTRL: {
        defaultValue: '2',
        menu: [
          [
            <Text
              id="blocks.tts20.numberNumber"
              defaultMessage="numbers"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.tts20.numberValue"
              defaultMessage="a value"
            />,
            '2',
          ],
          [
            <Text
              id="blocks.tts20.numberPhone"
              defaultMessage="a phone"
            />,
            '3',
          ],
        ],
      },
    },
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const num = this.valueToCode(block, 'NUM', this.ORDER_ATOMIC);
      const ctrl = block.getFieldValue('CTRL');
      let code = '';
      code += this.quote_(`[n${ctrl}]`);
      if (isNaN(num)) {
        code += `+String(${num})`;
      } else {
        code += this.quote_(num);
      }
      return [code];
    },
  },
  {
    id: 'pinyin',
    text: (
      <Text
        id="blocks.tts20.pinyin"
        defaultMessage="pinyin for [CHAR] is [PINYIN]"
      />
    ),
    output: 'string',
    inputs: {
      CHAR: {
        type: 'string',
        defaultValue: '好',
      },
      PINYIN: {
        type: 'string',
        defaultValue: 'hao3',
      },
    },
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const char = this.valueToCode(block, 'CHAR', this.ORDER_ATOMIC);
      const pinyin = this.valueToCode(block, 'PINYIN', this.ORDER_ATOMIC);
      let code = '';
      if (/^".*"$/.test(char)) {
        code += char;
      } else {
        code += `String(${char})+`;
      }
      if (/^".*"$/.test(pinyin)) {
        code += this.quote_(`[=${pinyin.replace(/^"|"$/g, '')}]`);
      } else {
        code += this.quote_('[=');
        code += `+String(${pinyin})+`;
        code += this.quote_(']');
      }
      return [code];
    },
  },
  {
    id: 'effect',
    text: (
      <Text
        id="blocks.tts20.effect"
        defaultMessage="[RING] effect [NUM]"
      />
    ),
    output: 'string',
    inputs: {
      RING: {
        menu: [
          [
            <Text
              id="blocks.tts20.effectRing"
              defaultMessage="ring"
            />,
            'ring',
          ],
          [
            <Text
              id="blocks.tts20.effectMessage"
              defaultMessage="message"
            />,
            'message',
          ],
          [
            <Text
              id="blocks.tts20.effectAlert"
              defaultMessage="alert"
            />,
            'alert',
          ],
        ],
      },
      NUM: {
        menu: [1, 2, 3, 4, 5],
      },
    },
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const ring = block.getFieldValue('RING');
      const num = block.getFieldValue('NUM');
      const code = this.quote_(`${ring}_${num}`);
      return [code];
    },
  },
  {
    id: 'break',
    text: (
      <Text
        id="blocks.tts20.break"
        defaultMessage="break"
      />
    ),
    output: 'string',
    ino(block) {
      const code = this.quote_('[w0]');
      return [code];
    },
  },
  '---',
  {
    id: 'pause',
    text: (
      <Text
        id="blocks.tts20.pause"
        defaultMessage="pause"
      />
    ),
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const code = 'tts20.Pause();\n';
      return code;
    },
  },
  {
    id: 'resume',
    text: (
      <Text
        id="blocks.tts20.resume"
        defaultMessage="resume"
      />
    ),
    ino(block) {
      if (!this.definitions_['variable_tts20']) {
        this.definitions_['variable_tts20'] = `em::Tts20 tts20(em::Tts20::kDefaultI2cAddress);`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts20.Init();`;
      }
      const code = 'tts20.Resume();\n';
      return code;
    },
  },
];
