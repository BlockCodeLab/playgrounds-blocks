import { Text } from '@blockcode/core';

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
      this.definitions_['include_regexp'] = '#include <Regexp.h>';
      this.definitions_['include_softwareserial'] = '#include <SoftwareSerial.h>';
      this.definitions_['variable_aivoxAssistant'] = `SoftwareSerial aivoxAssistant(${rx}, ${tx});`;
      this.definitions_['setup_aivoxAssistant'] = 'aivoxAssistant.begin(115200);';
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
  },
  {
    id: 'argument',
    text: (
      <Text
        id="blocks.aivoxassistant.argument"
        defaultMessage="argument [ARG] of command"
      />
    ),
    output: 'string',
    inputs: {
      ARG: {
        type: 'string',
        defaultValue: 'x',
      },
    },
    ino(block) {
      const argName = this.valueToCode(block, 'ARG', this.ORDER_NONE);
      const rootBlock = block.getRootBlock();
      const cmd = this.valueToCode(rootBlock, 'CMD', this.ORDER_NONE);

      let code = '';
      code += 'String getCommandArgument(uint8_t idx) {\n';
      code += '  char arg[100];\n';
      code += '  cmdRe.GetCapture(arg, idx);\n';
      code += '  return String(arg);\n';
      code += '}';
      this.definitions_['getCommandArgument'] = code;
      this.definitions_['declare_getCommandArgument'] = 'String getCommandArgument(uint8_t idx);';

      let argIndex = 0;
      const matches = [...cmd.matchAll(/\{(\w+)\}/g)];
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1] === argName) {
          argIndex = i;
          break;
        }
      }

      code = `getCommandArgument(${argIndex})`;
      return [code];
    },
  },
];
