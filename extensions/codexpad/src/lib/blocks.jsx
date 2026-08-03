import { changeCase } from '@blockcode/utils';
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
  STATE: {
    items: [
      [
        <Text
          id="blocks.codexpad.keyStatePressed"
          defaultMessage="Pressed"
        />,
        'pressed',
      ],
      [
        <Text
          id="blocks.codexpad.keyStateHolding"
          defaultMessage="Holding"
        />,
        'holding',
      ],
      [
        <Text
          id="blocks.codexpad.keyStateReleased"
          defaultMessage="Released"
        />,
        'released',
      ],
    ],
  },
};

export const blocks = (meta) => [
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
        defaultValue: '00:00:00:00:00:00',
      },
    },
    mpy(_, args, defs) {
      defs['import_asyncio'] = 'import asyncio';
      defs['codexpad'] = 'codex_pad = codexpad.CodexPad()';
      const code = `asyncio.create_task(codex_pad.connect(${args.MAC}, timeout_ms=60_000))\n`;
      return code;
    },
    ino(_, args, defs) {
      defs['variable_codexpad'] = `CodexPad codexpad(Serial);`;
      defs['setup_serial_baudrate'] = `Serial.begin(115200);`;
      defs['setup_codexpad_connect'] = `codexpad.Connect(${args.MAC});`;
      return '';
    },
  },
  !meta.isArduino && {
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
      code += `await codex_pad.scan_and_connect_10(${keys.join('|')})\n`;
      return code;
    },
  },
  !meta.isArduino && {
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
  !meta.isArduino && {
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
  !meta.isArduino && {
    id: 'whenPressed',
    text: (
      <Text
        id="blocks.codexpad.whenPressed"
        defaultMessage="when [KEY] [STATE]"
      />
    ),
    hat: true,
    inputs: {
      KEY: {
        menu: 'KEYS',
        defaultValue: 'CROSS_A',
      },
      STATE: {
        menu: 'STATE',
        defaultValue: 'pressed',
      },
    },
    mpy(block) {
      const key = block.getFieldValue('KEY');
      const state = block.getFieldValue('STATE');

      CodexPadUpdate(this);

      const flagName = this.createName('codexpad_flag');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      const funcName = this.createName(`codexpad_${key}_${state}`);
      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, `codexpad_${key}_${state}`);
      code = '@_tasks__.append\n';
      code += branchCode;
      this.definitions_[funcName] = code;

      code = `    if codex_pad.${state}(codexpad.BUTTON_${key}): ${flagName}.set()\n`;
      this.definitions_['codexpad_update'] += code;
    },
  },
  !meta.isArduino && {
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

      code = `    if codex_pad._prev_inputs.axis_values[codexpad.AXIS_${joystick}] ${way === '>' ? '<=' : '>='} ${value} and codex_pad.axis_values[codexpad.AXIS_${joystick}] ${way} ${value}: ${flagName}.set()\n`;
      this.definitions_['codexpad_update'] += code;
    },
  },
  '---',
  meta.isArduino && {
    id: 'trackerUpdate',
    text: (
      <Text
        id="blocks.codexpad.trackerUpdate"
        defaultMessage="update status"
      />
    ),
    ino() {
      const code = 'codexpad.Update();\n';
      return code;
    },
  },
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
      CodexPadUpdate(this);
      const code = `await codex_pad.axis_value(codexpad.AXIS_${args.JOYSTICK})`;
      return [code];
    },
    ino(_, args) {
      const code = `codexpad.Axis(gamepad::input::Axis::k${changeCase.pascalCase(args.JOYSTICK)})`;
      return [code];
    },
  },
  {
    id: 'keyPressed',
    text: (
      <Text
        id="blocks.codexpad.keyPressed"
        defaultMessage="[KEY] is [STATE]?"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        menu: 'KEYS',
        defaultValue: 'CROSS_A',
      },
      STATE: {
        menu: 'STATE',
        defaultValue: 'holding',
      },
    },
    mpy(_, args) {
      CodexPadUpdate(this);
      const code = `await codex_pad.${args.STATE}(codexpad.BUTTON_${args.KEY})`;
      return [code];
    },
    ino(_, args) {
      const code = `codexpad.${changeCase.pascalCase(args.STATE)}(gamepad::input::Button::k${changeCase.pascalCase(args.KEY)})`;
      return [code];
    },
  },
];
