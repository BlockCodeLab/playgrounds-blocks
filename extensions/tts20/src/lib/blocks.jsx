import { Text } from '@blockcode/core';

const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';
const isIotBit = (meta) => meta.editor === '@emakefun/gui-iotbit';

export const blocks = (meta) =>
  [
    notArduino(meta) && {
      id: 'init',
      text: (
        <Text
          id="blocks.tts20.init"
          defaultMessage="set pins SCL:[SCL] SDA:[SDA]"
        />
      ),
      inputs: {
        SCL: meta.boardPins
          ? { menu: meta.boardPins.all, defaultValue: isIotBit(meta) ? '22' : '2' }
          : {
              type: 'integer',
              defaultValue: '2',
            },
        SDA: meta.boardPins
          ? { menu: meta.boardPins.all, defaultValue: isIotBit(meta) ? '23' : '3' }
          : {
              type: 'integer',
              defaultValue: '3',
            },
      },
      mpy(block) {
        const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
        const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);

        if (this.definitions_['tts20_addr']) {
          const addr = this.definitions_['tts20_addr'].replace('# TTS20 addr: ', '');
          this.definitions_['tts20'] = `tts = tts20.TTS20(${scl}, ${sda}, ${addr})`;
          delete this.definitions_['tts20_addr'];
        } else {
          this.definitions_['tts20'] = `tts = tts20.TTS20(${scl}, ${sda})`;
        }
        return '';
      },
    },
    {
      id: 'addr',
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
        this.definitions_['variable_tts20'] = `em::Tts20 tts(${addr});`;
        this.definitions_['setup_wire'] = 'Wire.begin();';
        this.definitions_['setup_tts20'] = `tts.Init();`;
        return '';
      },
      mpy(block) {
        const addr = block.getFieldValue('ADDR');
        if (this.definitions_['tts20']) {
          this.definitions_['tts20'] = this.definitions_['tts20'].replace(/(\d+)\)$/, `$1, ${addr})`);
        } else {
          this.definitions_['tts20_addr'] = `# TTS20 addr: ${addr}`;
        }
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
        }
        const code = `tts.Play(${str});\n`;
        return code;
      },
      mpy(block) {
        const str = this.valueToCode(block, 'STR', this.ORDER_ATOMIC);
        const code = `tts.play(${str})\n`;
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
        }
        const code = 'tts.Stop();\n';
        return code;
      },
      mpy(block) {
        const code = 'tts.stop()\n';
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
        }
        const code = '!tts20.IsBusy()';
        return [code];
      },
      mpy(block) {
        const code = '(not tts.is_busy())';
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
              'v',
            ],
            [
              <Text
                id="blocks.tts20.controlSpeed"
                defaultMessage="speed"
              />,
              's',
            ],
            [
              <Text
                id="blocks.tts20.controlTone"
                defaultMessage="tone"
              />,
              't',
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
        }
        const str = this.valueToCode(block, 'STR', this.ORDER_ATOMIC);
        const ctrl = block.getFieldValue('CTRL');
        const num = block.getFieldValue('NUM');
        let code = '';
        code += this.quote_(`[${ctrl}${num}]`);
        if (/^".*"$/.test(str)) {
          code += str;
        } else {
          code += `+String(${str})`;
        }
        return [code];
      },
      mpy(block) {
        const str = this.valueToCode(block, 'STR', this.ORDER_ATOMIC);
        const ctrl = block.getFieldValue('CTRL');
        const num = block.getFieldValue('NUM');
        const code = this.quote_(`[${ctrl}${num}]`) + `+str(${str})`;
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
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
      mpy(block) {
        const num = this.valueToCode(block, 'NUM', this.ORDER_ATOMIC);
        const ctrl = block.getFieldValue('CTRL');
        const code = this.quote_(`[n${ctrl}]`) + `+str(${num})`;
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
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
      mpy(block) {
        const char = this.valueToCode(block, 'CHAR', this.ORDER_ATOMIC);
        const pinyin = this.valueToCode(block, 'PINYIN', this.ORDER_ATOMIC);
        const code = `str(${char})+` + this.quote_(`[=${pinyin.replace(/^["']|["']$/g, '')}]`);
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
        }
        const ring = block.getFieldValue('RING');
        const num = block.getFieldValue('NUM');
        const code = this.quote_(`${ring}_${num}`);
        return [code];
      },
      mpy(block) {
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
      mpy(block) {
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
        }
        const code = 'tts.Pause();\n';
        return code;
      },
      mpy(block) {
        const code = 'tts.pause()\n';
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
          this.definitions_['variable_tts20'] = `em::Tts20 tts(em::Tts20::kDefaultI2cAddress);`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_tts20'] = `tts.Init();`;
        }
        const code = 'tts.Resume();\n';
        return code;
      },
      mpy(block) {
        const code = 'tts.resume()\n';
        return code;
      },
    },
  ].filter(Boolean);
