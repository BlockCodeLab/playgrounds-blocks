import { pinyin, changeCase } from '@blockcode/utils';
import { Text } from '@blockcode/core';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

const InitSpeechRecognizer = (gen) => {
  gen.definitions_['include_wire'] = '#include <Wire.h>';
  gen.definitions_['variable_speech_recognizer'] = 'emakefun::SpeechRecognizer speech_recognizer;';
  gen.definitions_['setup_wire'] = 'Wire.begin();';
  gen.definitions_['setup_speech_recognizer'] = 'speech_recognizer.Initialize();';

  const funcName = 'speechRecognition';
  if (!gen.definitions_[funcName]) {
    let code = '';
    code += `void ${funcName}() {\n`;
    code += '  int16_t result = speech_recognizer.Recognize();\n';
    code += '  if (result < 0) return;\n';
    code += '}';
    gen.definitions_[funcName] = code;
    gen.definitions_[`declare_${funcName}`] = `void ${funcName}();`;
  }
};

export const blocks = (meta) => [
  !isArduino(meta) && {
    id: 'init',
    text: (
      <Text
        id="blocks.ld3320asr.init"
        defaultMessage="set pins SCL:[SCL] SDA:[SDA]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      SDA: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    mpy(block) {
      const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
      const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);
      this.definitions_['import_i2c'] = 'from machine import I2C';
      this.definitions_['init_asr'] = `asr = speech_recognizer.SpeechRecognizer(I2C(1, scl=${scl}, sda=${sda}))`;
      return '';
    },
  },
  {
    id: 'mode',
    text: (
      <Text
        id="blocks.ld3320asr.mode"
        defaultMessage="set recognition mode to [MODE]"
      />
    ),
    inputs: {
      MODE: {
        menu: [
          [
            <Text
              id="blocks.ld3320asr.modeAuto"
              defaultMessage="auto"
            />,
            'RecognitionAuto',
          ],
          [
            <Text
              id="blocks.ld3320asr.modeButton"
              defaultMessage="button"
            />,
            'ButtonTrigger',
          ],
          [
            <Text
              id="blocks.ld3320asr.modeKeyword"
              defaultMessage="keyword"
            />,
            'KeywordTrigger',
          ],
          [
            <Text
              id="blocks.ld3320asr.modeButtonKeyword"
              defaultMessage="button or keyword"
            />,
            'KeywordOrButtonTrigger',
          ],
        ],
      },
    },
    ino(block) {
      InitSpeechRecognizer(this);
      const mode = block.getFieldValue('MODE');
      this.definitions_['setup_asr_mode'] =
        `speech_recognizer.SetRecognitionMode(emakefun::SpeechRecognizer::k${mode});`;
      return '';
    },
    mpy(block) {
      const mode = block.getFieldValue('MODE');
      const code = `asr.set_recognition_mode(speech_recognizer.SpeechRecognizer.${changeCase.constantCase(mode)})\n`;
      return code;
    },
  },
  {
    id: 'setKeyword',
    text: (
      <Text
        id="blocks.ld3320asr.setKeyword"
        defaultMessage="set keyword to [KEYWORD]"
      />
    ),
    inputs: {
      KEYWORD: {
        type: 'string',
        defaultValue: '小易小易',
      },
    },
    ino(block) {
      InitSpeechRecognizer(this);
      const keyword = this.valueToCode(block, 'KEYWORD', this.ORDER_NONE);
      const keywordPinYin = pinyin(keyword.replace(/^['"](.*)['"]$/, '$1'), {
        toneType: 'none',
        traditional: true,
      });
      this.definitions_[`setup_asr_keyword`] = `speech_recognizer.AddKeyword(0, F(${this.quote_(keywordPinYin)}));`;
      return '';
    },
    mpy(block) {
      const keyword = this.valueToCode(block, 'KEYWORD', this.ORDER_NONE);
      const keywordPinYin = pinyin(keyword.replace(/^['"](.*)['"]$/, '$1'), {
        toneType: 'none',
        traditional: true,
      });
      const code = `asr.add_keyword(0, ${this.quote_(keywordPinYin)})\n`;
      return code;
    },
  },
  {
    id: 'setTimeout',
    text: (
      <Text
        id="blocks.ld3320asr.setTimeout"
        defaultMessage="set timeout to [MS]"
      />
    ),
    inputs: {
      MS: {
        type: 'number',
        defaultValue: 10000,
      },
    },
    ino(block) {
      InitSpeechRecognizer(this);
      const ms = this.valueToCode(block, 'MS', this.ORDER_NONE);
      const code = `speech_recognizer.SetTimeout(${ms});\n`;
      return code;
    },
    mpy(block) {
      const ms = this.valueToCode(block, 'MS', this.ORDER_NONE);
      const code = `asr.set_timeout(${ms})\n`;
      return code;
    },
  },
  '---',
  isArduino(meta) && {
    id: 'eventPolling',
    text: (
      <Text
        id="blocks.ld3320asr.eventPolling"
        defaultMessage="recognition events polling"
      />
    ),
    ino(block) {
      InitSpeechRecognizer(this);
      const code = 'speechRecognition();\n';
      return code;
    },
  },
  {
    id: 'whenRecognized',
    text: (
      <Text
        id="blocks.ld3320asr.whenRecognized"
        defaultMessage="when recognized [KEYWORD]"
      />
    ),
    hat: true,
    inputs: {
      KEYWORD: {
        type: 'string',
        defaultValue: '小易小易',
      },
    },
    ino(block) {
      InitSpeechRecognizer(this);
      const keyword = this.valueToCode(block, 'KEYWORD', this.ORDER_NONE);
      const keywordPinYin = pinyin(keyword.replace(/^['"](.*)['"]$/, '$1'), {
        toneType: 'none',
        traditional: true,
      });

      const keywordIndex = this.createName('asr_keyword').replace('asr_keyword_', '');
      this.definitions_[`setup_asr_keyword_${keywordPinYin}`] =
        `speech_recognizer.AddKeyword(${keywordIndex}, F(${this.quote_(keywordPinYin)}));`;

      const funcName = this.getDistinctName(keywordPinYin);

      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${funcName}`] = `void ${funcName}();`;
      this.definitions_[funcName] = `void ${funcName}() {\n${branchCode}}`;

      this.definitions_['speechRecognition'] = this.definitions_['speechRecognition'].replace(
        ';\n}',
        `;\n  if (result == ${keywordIndex}) return ${funcName}();\n}`,
      );
    },
    mpy(block) {
      if (!this.definitions_['speech_recognition']) {
        let code = '';
        code += '@_tasks__.append\n';
        code += 'async def speech_recognition():\n';
        code += '  while True:\n';
        code += '    await asyncio.sleep_ms(5)\n';
        code += '    result = asr.recognize()\n';
        code += '    if result < 0: continue\n';
        this.definitions_['speech_recognition'] = code;
      }

      const keyword = this.valueToCode(block, 'KEYWORD', this.ORDER_NONE);
      const keywordPinYin = pinyin(keyword.replace(/^['"](.*)['"]$/, '$1'), {
        toneType: 'none',
        traditional: true,
      });

      const flagName = this.createName('asr_keyword');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      const funcName = this.getDistinctName(keywordPinYin);
      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, 'assistant_callback');
      code = '@_tasks__.append\n';
      code += branchCode;
      this.definitions_[funcName] = code;

      const keywordIndex = flagName.replace('asr_keyword_', '');
      this.definitions_['speech_recognition'] = this.definitions_['speech_recognition'].replace(
        '  while True:\n',
        `  asr.add_keyword(${keywordIndex}, ${this.quote_(keywordPinYin)})\n  while True:\n`,
      );
      this.definitions_['speech_recognition'] += `    if result == ${keywordIndex}: ${flagName}.set(); continue\n`;
    },
  },
];
