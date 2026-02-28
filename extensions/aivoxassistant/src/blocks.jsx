import { Text } from '@blockcode/core';

const isArduino = (meta) => meta.editor === '@blockcode/gui-arduino';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.aivoxassistant.init"
        defaultMessage="set pins RX:[RX] TX:[TX]"
      />
    ),
    inputs: {
      RX: meta.boardPins
        ? { menu: meta.boardPins.all }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      TX: meta.boardPins
        ? { menu: meta.boardPins.all }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    ino(block) {
      const rx = meta.boardPins ? block.getFieldValue('RX') : this.valueToCode(block, 'RX', this.ORDER_NONE);
      const tx = meta.boardPins ? block.getFieldValue('TX') : this.valueToCode(block, 'TX', this.ORDER_NONE);
      this.definitions_['include_softwareserial'] = '#include <SoftwareSerial.h>';
      this.definitions_['variable_aivoxAssistant'] = `SoftwareSerial aivoxAssistant(${rx}, ${tx});`;
      this.definitions_['setup_aivoxAssistant'] = 'aivoxAssistant.begin(115200);';
      return '';
    },
    mpy(block) {
      const rx = meta.boardPins ? block.getFieldValue('RX') : this.valueToCode(block, 'RX', this.ORDER_NONE);
      const tx = meta.boardPins ? block.getFieldValue('TX') : this.valueToCode(block, 'TX', this.ORDER_NONE);
      this.definitions_['import_uart'] = 'from machine import UART';
      this.definitions_['aivox_assistant'] = `aivox_assistant = UART(1, baudrate=115200, rx=${rx}, tx=${tx})`;
      return '';
    },
  },
  '---',
  {
    id: 'whenCommand',
    text: (
      <Text
        id="blocks.aivoxassistant.whenCommand"
        defaultMessage="when receive [CMD] command"
      />
    ),
    hat: true,
    inputs: {
      CMD: {
        type: 'string',
        defaultValue: 'turn on led',
      },
    },
    ino(block) {
      this.definitions_['include_regexp'] = '#include <Regexp.h>';
      this.definitions_['variable_commandReg'] = 'MatchState cmdRe;';
      if (!this.definitions_['processAssistant']) {
        let code = '';
        code += 'void processAssistant() {\n';
        code += '  if (aivoxAssistant.available() == 0) return;\n';
        code += "  String cmd = aivoxAssistant.readStringUntil('\\n');\n";
        code += '  cmdRe.Target(cmd.c_str());\n';
        code += '}';
        this.definitions_['processAssistant'] = code;
        this.definitions_['declare_processAssistant'] = 'void processAssistant();';
        this.definitions_['loop_processAssistant'] = 'processAssistant();';
      }

      const funcName = this.createName('assistantCommand');
      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${funcName}`] = `void ${funcName}();`;
      this.definitions_[funcName] = `void ${funcName}() {\n${branchCode}}`;

      const cmd = this.valueToCode(block, 'CMD', this.ORDER_NONE);
      const cmdReStr = cmd.replace(/\{\S+\}/g, '(%S+)').replace(/\s+/g, '%s+');
      this.definitions_['processAssistant'] = this.definitions_['processAssistant'].replace(
        ';\n}',
        `;\n  if (cmdRe.Match(${cmdReStr}) > 0) return ${funcName}();\n}`,
      );
    },
    mpy(block) {
      this.definitions_['import_re'] = 'import re';
      this.definitions_['assistant_matched'] = 'assistant_matched = None';
      if (!this.definitions_['assistant_received']) {
        let code = '';
        code += '@_tasks__.append\n';
        code += 'async def assistant_received():\n';
        code += '  global assistant_matched\n';
        code += '  while True:\n';
        code += '    await asyncio.sleep_ms(5)\n';
        code += '    if not aivox_assistant.any(): continue\n';
        code += '    cmd = aivox_assistant.readline()\n';
        this.definitions_['assistant_received'] = code;
      }

      const flagName = this.createName('assistant_flag');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'global assistant_matched\n';
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      const cmd = this.valueToCode(block, 'CMD', this.ORDER_NONE);
      const funcName = this.getDistinctName(cmd);
      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, 'assistant_callback');
      code = '@_tasks__.append\n';
      code += branchCode;
      this.definitions_[funcName] = code;

      const cmdReStr = cmd.replace(/\{\S+\}/g, '(\\S+)').replace(/\s+/g, '\\s+');
      code = '';
      code += `    assistant_matched = re.match(${cmdReStr}, cmd)\n`;
      code += `    if assistant_matched: ${flagName}.set(); continue\n`;
      this.definitions_['assistant_received'] += code;
    },
  },
  {
    id: 'argument',
    text: (
      <Text
        id="blocks.aivoxassistant.argument"
        defaultMessage="[TYPE] argument [ARG] of command"
      />
    ),
    output: 'string',
    inputs: {
      TYPE: {
        menu: isArduino(meta) ? 'ArduinoTypes' : 'Types',
      },
      ARG: {
        type: 'string',
        defaultValue: 'x',
      },
    },
    ino(block) {
      const rootBlock = block.getRootBlock();
      if (block.parentBlock_ === rootBlock) {
        return '';
      }

      const argName = JSON.parse(this.valueToCode(block, 'ARG', this.ORDER_NONE));
      const cmd = this.valueToCode(rootBlock, 'CMD', this.ORDER_NONE);
      const type = block.getFieldValue('TYPE');

      this.definitions_['include_regexp'] = '#include <Regexp.h>';
      this.definitions_['variable_commandReg'] = 'MatchState cmdRe;';

      let code = '';
      code += `String getCommandArgument(uint8_t idx) {\n`;
      code += '  char arg[100];\n';
      code += '  cmdRe.GetCapture(arg, idx);\n';
      code += '  return String(arg);\n';
      code += '}';
      this.definitions_['getCommandArgument'] = code;
      this.definitions_['declare_getCommandArgument'] = `String getCommandArgument(uint8_t idx);`;

      let argIndex = 0;
      const matches = [...cmd.matchAll(/\{(\w+)\}/g)];
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1] === argName) {
          argIndex = i;
          break;
        }
      }

      let toType = '';
      if (type !== 'String') {
        toType = `.to${type.charAt(0).toUpperCase()}${type.slice(1)}()`;
      }
      code = `getCommandArgument(${argIndex})${toType}`;
      return [code];
    },
    mpy(block) {
      const rootBlock = block.getRootBlock();
      if (block.parentBlock_ === rootBlock) {
        return '';
      }

      const argName = JSON.parse(this.valueToCode(block, 'ARG', this.ORDER_NONE));
      const cmd = this.valueToCode(rootBlock, 'CMD', this.ORDER_NONE);
      const type = block.getFieldValue('TYPE');

      this.definitions_['import_re'] = 'import re';
      this.definitions_['assistant_matched'] = 'assistant_matched = None';

      let argIndex = 0;
      const matches = [...cmd.matchAll(/\{(\w+)\}/g)];
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1] === argName) {
          argIndex = i + 1;
          break;
        }
      }

      let toType = 'float';
      if (type !== 'float') {
        toType = type.slice(0, 3).toLowerCase();
      }

      const code = `${toType}(${toType === 'str' ? '""' : 0} if not assistant_matched else assistant_matched.group(${argIndex}))`;
      return [code];
    },
  },
];

export const menus = {
  Types: {
    items: [
      [
        <Text
          id="blocks.aivoxassistant.argumentInt"
          defaultMessage="int"
        />,
        'int',
      ],
      [
        <Text
          id="blocks.aivoxassistant.argumentFloat"
          defaultMessage="float"
        />,
        'float',
      ],
      [
        <Text
          id="blocks.aivoxassistant.argumentString"
          defaultMessage="string"
        />,
        'String',
      ],
    ],
  },
  ArduinoTypes: {
    items: ['int', 'float', 'String'],
  },
};
