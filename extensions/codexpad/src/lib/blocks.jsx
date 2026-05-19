import { Text } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

const CodexPadUpdate = (gen) => {
  if (!gen.definitions_['codexpad_update']) {
    let code = '';
    code += '@_tasks__.append\n';
    code += 'async def codexpad_update():\n';
    code += '  while True:\n';
    code += '    await codex_pad.update()\n';
    code += '    await asyncio.sleep_ms(5)\n';
    gen.definitions_['codexpad_update'] = code;
  }
};

export const menus = {
  KEYS: {
    items: [
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_UP, 'UP'],
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_DOWN, 'DOWN'],
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_LEFT, 'LEFT'],
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_RIGHT, 'RIGHT'],
      ['X (□)', 'SQUARE_X'],
      ['Y (△)', 'TRIANGLE_Y'],
      ['A (✕)', 'CROSS_A'],
      ['B (○)', 'CIRCLE_B'],
      ['L1', 'L1'],
      ['L2', 'L2'],
      ['L3', 'L3'],
      ['R1', 'R1'],
      ['R2', 'R2'],
      ['R3', 'R3'],
      ['SELECT', 'SELECT'],
      ['START', 'START'],
      ['HOME', 'HOME'],
    ],
  },
  JOYSTICK: {
    items: [
      [
        <Text
          id="blocks.codexpad.joystickLXAxis"
          defaultMessage="left joystick X"
        />,
        'LEFT_STICK_X',
      ],
      [
        <Text
          id="blocks.codexpad.joystickLYAxis"
          defaultMessage="left joystick Y"
        />,
        'LEFT_STICK_Y',
      ],
      [
        <Text
          id="blocks.codexpad.joystickRXAxis"
          defaultMessage="right joystick X"
        />,
        'RIGHT_STICK_X',
      ],
      [
        <Text
          id="blocks.codexpad.joystickRYAxis"
          defaultMessage="right joystick Y"
        />,
        'RIGHT_STICK_Y',
      ],
    ],
  },
};

export const blocks = [
  {
    id: 'connect',
    text: (
      <Text
        id="blocks.codexpad.connect"
        defaultMessage="connect CodexPad with mac:[MAC]"
      />
    ),
    inputs: {
      MAC: {
        type: 'string',
        defaultValue: '',
      },
    },
    mpy(block) {
      const mac = this.valueToCode(block, 'MAC', this.ORDER_NONE);
      this.definitions_['import_asyncio'] = 'import asyncio';
      this.definitions_['codexpad'] = 'codex_pad = codexpad.CodexPad()';
      const code = `asyncio.create_task(codex_pad.connect(${mac}, timeout_ms=60_000))\n`;
      return code;
    },
  },
  {
    id: 'scanConnect',
    text: (
      <Text
        id="blocks.codexpad.scanConnect"
        defaultMessage="connect CodexPad with [BTNA] and [BTNB] combo"
      />
    ),
    inputs: {
      BTNA: {
        menu: 'KEYS',
        defaultValue: 'START',
      },
      BTNB: {
        menu: [['', '']].concat(menus.KEYS.items),
      },
    },
    mpy(block) {
      const keyA = block.getFieldValue('BTNA');
      const keyB = block.getFieldValue('BTNB');
      const keys = [`codexpad.BUTTON_${keyA}`];
      if (keyB) {
        keys.push(`codexpad.BUTTON_${keyB}`);
      }
      this.definitions_['import_asyncio'] = 'import asyncio';
      this.definitions_['codexpad'] = 'codex_pad = codexpad.CodexPad()';
      let code = '';
      code += 'try:\n';
      code += `  await codex_pad.scan_and_connect(${keys.join('|')}, scan_duration_ms=1000, connect_timeout_ms=5000)\n`;
      code += 'except Exception as e:\n';
      code += '  pass\n';
      return code;
    },
  },
  {
    id: 'paLevel',
    text: (
      <Text
        id="blocks.codexpad.paLevel"
        defaultMessage="set power amplifier level to [PA] dBm"
      />
    ),
    inputs: {
      PA: {
        defaultValue: '0',
        menu: [
          ['-16', 'MINUS_16'],
          ['-12', 'MINUS_12'],
          ['-8', 'MINUS_8'],
          ['-5', 'MINUS_5'],
          ['-3', 'MINUS_3'],
          ['-1', 'MINUS_1'],
          ['0', '0'],
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
        ],
      },
    },
    mpy(block) {
      const pa = block.getFieldValue('PA') || '0';
      let code = '';
      code += `await codex_pad.set_remote_tx_power(codexpad.TX_POWER_${pa}_DBM)\n`;
      return code;
    },
  },
  {
    id: 'isConnected',
    text: (
      <Text
        id="blocks.codexpad.isconnected"
        defaultMessage="CodexPad is connected?"
      />
    ),
    output: 'boolean',
    mpy(block) {
      const code = `codex_pad.is_connected`;
      return [code];
    },
  },
  '---',
  {
    id: 'whenPressed',
    text: (
      <Text
        id="blocks.codexpad.whenPressed"
        defaultMessage="when [KEY] pressed"
      />
    ),
    hat: true,
    inputs: {
      KEY: {
        menu: 'KEYS',
        defaultValue: 'CROSS_A',
      },
    },
    mpy(block) {
      const key = block.getFieldValue('KEY');

      CodexPadUpdate(this);

      const flagName = this.createName('codexpad_flag');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      const funcName = this.createName(`codexpad_${key}_pressed`);
      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, `codexpad_${key}_pressed`);
      code = '@_tasks__.append\n';
      code += branchCode;
      this.definitions_[funcName] = code;

      code = `    if codex_pad.pressed(codexpad.BUTTON_${key}): ${flagName}.set()\n`;
      this.definitions_['codexpad_update'] += code;
    },
  },
  {
    id: 'whenJoystickMoved',
    text: (
      <Text
        id="blocks.codexpad.whenJoystickMoved"
        defaultMessage="when [JOYSTICK] axis [WAY] [VALUE]"
      />
    ),
    hat: true,
    inputs: {
      JOYSTICK: {
        menu: 'JOYSTICK',
      },
      WAY: {
        menu: ['>', '<'],
      },
      VALUE: {
        type: 'integer',
        defaultValue: 150,
      },
    },
    mpy(block) {
      const joystick = block.getFieldValue('JOYSTICK');
      const way = block.getFieldValue('WAY');
      const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);

      CodexPadUpdate(this);

      const flagName = this.createName('codexpad_flag');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      const funcName = this.createName(`codexpad_${joystick}_${way === '>' ? 'greater' : 'less'}`);
      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, `codexpad_${joystick}_${way === '>' ? 'greater' : 'less'}`);
      code = '@_tasks__.append\n';
      code += branchCode;
      this.definitions_[funcName] = code;

      code = `    if codex_pad._prev_inputs.axis_values[codexpad.AXIS_${joystick}] ${way === '>' ? '<=' : '>='} ${value} and codex_pad.axis_value(codexpad.AXIS_${joystick}) ${way} ${value}: ${flagName}.set()\n`;
      this.definitions_['codexpad_update'] += code;
    },
  },
  '---',
  {
    id: 'joystickValue',
    text: (
      <Text
        id="blocks.codexpad.joystickValue"
        defaultMessage="[JOYSTICK] axis value (0~255)"
      />
    ),
    output: 'number',
    inputs: {
      JOYSTICK: {
        menu: 'JOYSTICK',
      },
    },
    mpy(block) {
      const joystick = block.getFieldValue('JOYSTICK');
      const code = `codex_pad.axis_value(codexpad.AXIS_${joystick})`;
      return [code];
    },
  },
  {
    id: 'keyPressed',
    text: (
      <Text
        id="blocks.codexpad.keyPressed"
        defaultMessage="[KEY] is pressed"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        menu: 'KEYS',
        defaultValue: 'CROSS_A',
      },
    },
    mpy(block) {
      const key = block.getFieldValue('KEY');
      const code = `codex_pad.pressed(codexpad.BUTTON_${key})`;
      return [code];
    },
  },
];
