import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.encodermotor.init"
        defaultMessage="set [MOTOR] encoder motor pin+ [PIN1] pin- [PIN2] pinA [PINA] pinB [PINB]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
      PIN1: meta.boardPins
        ? {
            menu: meta.boardPins.pwm,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      PIN2: meta.boardPins
        ? {
            menu: meta.boardPins.out,
          }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      PINA: meta.boardPins
        ? {
            menu: meta.boardPins.in,
          }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
      PINB: meta.boardPins
        ? {
            menu: meta.boardPins.in,
          }
        : {
            type: 'positive_integer',
            defaultValue: 4,
          },
    },
    mpy(_, args, defs) {
      defs[`encodermotor_${args.MOTOR}`] =
        `encodermotor_${args.MOTOR} = encoder_motor.EncoderMotor(${args.PIN1}, ${args.PIN2}, ${args.PINA}, ${args.PINB})`;
      defs[`encodermotor_${args.MOTOR}_init`] = `encodermotor_${args.MOTOR}.init()`;
      return '';
    },
  },
  {
    id: 'setmotor',
    text: (
      <Text
        id="blocks.encodermotor.setmotor"
        defaultMessage="set [MOTOR] encoder motor to ratio [RATIO] [PULSE] ppr and [PHASE] phase leads"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
        defaultValue: 'all',
      },
      RATIO: {
        type: 'positive_integer',
        defaultValue: 90,
      },
      PULSE: {
        type: 'positive_integer',
        defaultValue: 12,
      },
      PHASE: {
        menu: ['A', 'B'],
      },
    },
    mpy(_, args, defs) {
      const motors = args.MOTOR === 'all' ? [0, 1, 2, 3] : [args.MOTOR];
      for (const id of motors) {
        defs[`encodermotor_${id}_init`] =
          `encodermotor_${id}.init(${args.RATIO}, ${args.PULSE}, encoder_motor.${args.PHASE}_PHASE_LEADS)`;
      }
      return '';
    },
  },
  {
    id: 'setspeed',
    text: (
      <Text
        id="blocks.encodermotor.setspeed"
        defaultMessage="set [MOTOR] encoder motor to [SPEED]% [DIR] speed"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
      },
      DIR: {
        menu: 'RotationDirection',
      },
      SPEED: {
        shadow: 'speedvalue',
        defaultValue: 100,
      },
    },
    mpy(_, args, defs) {
      let code = ``;
      const motors = args.MOTOR === 'all' ? [0, 1, 2, 3] : [args.MOTOR];
      const speed = Math.round(args.DIR * args.SPEED * 10.23);
      for (const id of motors) {
        code += `encodermotor_${id}.run_pwm_duty(${speed})\n`;
      }
      return code;
    },
  },
  {
    id: 'setrpm',
    text: (
      <Text
        id="blocks.encodermotor.setrpm"
        defaultMessage="set [MOTOR] encoder motor to [DIR] at [RPM] rpm"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
      },
      DIR: {
        menu: 'RotationDirection',
      },
      RPM: {
        type: 'positive_integer',
        defaultValue: 100,
      },
    },
    mpy(_, args, defs) {
      let code = ``;
      const motors = args.MOTOR === 'all' ? [0, 1, 2, 3] : [args.MOTOR];
      const rpm = args.DIR * args.RPM;
      for (const id of motors) {
        code += `encodermotor_${id}.run_speed(${rpm})\n`;
      }
      return code;
    },
  },
  // {
  //   id: 'setrotate',
  //   text: (
  //     <Text
  //       id="blocks.encodermotor.setrotate"
  //       defaultMessage="rotate [MOTOR] encoder motor to [DEGREE]° at [RPM] rpm"
  //     />
  //   ),
  //   inputs: {
  //     MOTOR: {
  //       menu: 'AllEncoderMotors',
  //     },
  //     DEGREE: {
  //       type: 'integer',
  //       defaultValue: 15,
  //     },
  //     RPM: {
  //       type: 'positive_integer',
  //       defaultValue: 100,
  //     },
  //   },
  //   mpy(_, args, defs) {},
  // },
  // {
  //   id: 'setangle',
  //   text: (
  //     <Text
  //       id="blocks.encodermotor.setangle"
  //       defaultMessage="set [MOTOR] encoder motor to [ANGLE]° at [RPM] rpm"
  //     />
  //   ),
  //   inputs: {
  //     MOTOR: {
  //       menu: 'AllEncoderMotors',
  //     },
  //     ANGLE: {
  //       type: 'integer',
  //       defaultValue: 90,
  //     },
  //     RPM: {
  //       type: 'positive_integer',
  //       defaultValue: 100,
  //     },
  //   },
  //   mpy(_, args, defs) {},
  // },
  {
    id: 'reset',
    text: (
      <Text
        id="blocks.encodermotor.reset"
        defaultMessage="reset [MOTOR] encoder motor"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
        defaultValue: 'all',
      },
    },
    mpy(_, args, defs) {
      let code = ``;
      const motors = args.MOTOR === 'all' ? [0, 1, 2, 3] : [args.MOTOR];
      const rpm = args.DIR * args.RPM;
      for (const id of motors) {
        code += `encodermotor_${id}.reset_pulse_count()\n`;
      }
      return code;
    },
  },
  {
    id: 'shutdown',
    text: (
      <Text
        id="blocks.encodermotor.shutdown"
        defaultMessage="stop [MOTOR] encoder motor"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
        defaultValue: 'all',
      },
    },
    mpy(_, args, defs) {
      let code = ``;
      const motors = args.MOTOR === 'all' ? [0, 1, 2, 3] : [args.MOTOR];
      const rpm = args.DIR * args.RPM;
      for (const id of motors) {
        code += `encodermotor_${id}.stop()\n`;
      }
      return code;
    },
  },
  '---',
  // {
  //   id: 'setpidangle',
  //   text: (
  //     <Text
  //       id="blocks.encodermotor.setpidangle"
  //       defaultMessage="set [MOTOR] encoder motor to P:[P] I:[I] D:[D] for angle pid controller"
  //     />
  //   ),
  //   inputs: {
  //     MOTOR: {
  //       menu: 'AllEncoderMotors',
  //     },
  //     P: {
  //       type: 'number',
  //       defaultValue: 10.0,
  //     },
  //     I: {
  //       type: 'number',
  //       defaultValue: 1.0,
  //     },
  //     D: {
  //       type: 'number',
  //       defaultValue: 1.0,
  //     },
  //   },
  //   mpy(_, args, defs) {},
  // },
  {
    id: 'setpidspeed',
    text: (
      <Text
        id="blocks.encodermotor.setpidspeed"
        defaultMessage="set [MOTOR] encoder motor to P:[P] I:[I] D:[D] for speed pid controller"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
      },
      P: {
        type: 'number',
        defaultValue: 1.5,
      },
      I: {
        type: 'number',
        defaultValue: 1.5,
      },
      D: {
        type: 'number',
        defaultValue: 1.0,
      },
    },
    mpy(_, args, defs) {
      let code = ``;
      const motors = args.MOTOR === 'all' ? [0, 1, 2, 3] : [args.MOTOR];
      for (const id of motors) {
        code += `encodermotor_${id}.set_speed_pid(${args.P}, ${args.I}, ${args.D})\n`;
      }
      return code;
    },
  },
  // {
  //   id: 'pidangle',
  //   text: (
  //     <Text
  //       id="blocks.encodermotor.pidangle"
  //       defaultMessage="encoder motor [MOTOR] angle pid controller [PID] value"
  //     />
  //   ),
  //   output: 'number',
  //   inputs: {
  //     MOTOR: {
  //       menu: 'EncoderMotors',
  //     },
  //     PID: {
  //       menu: ['P', 'I', 'D'],
  //     },
  //   },
  //   mpy(_, args, defs) {},
  // },
  {
    id: 'pidspeed',
    text: (
      <Text
        id="blocks.encodermotor.pidspeed"
        defaultMessage="encoder motor [MOTOR] speed pid controller [PID] value"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
      PID: {
        menu: ['P', 'I', 'D'],
      },
    },
    mpy(_, args, defs) {
      const code = `encodermotor_${args.MOTOR}.speed_pid_${args.PID.toLowerCase()}`;
      return [code];
    },
  },
  {
    id: 'speed',
    text: (
      <Text
        id="blocks.encodermotor.speed"
        defaultMessage="encoder motor [MOTOR] speed(%)"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
    },
    mpy(_, args, defs) {
      const code = `round(encodermotor_${args.MOTOR}.pwm_duty/10.23)`;
      return [code];
    },
  },
  {
    id: 'rpm',
    text: (
      <Text
        id="blocks.encodermotor.rpm"
        defaultMessage="encoder motor [MOTOR] rpm"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
    },
    mpy(_, args, defs) {
      const code = `encodermotor_${args.MOTOR}.speed`;
      return [code];
    },
  },
  // {
  //   id: 'angle',
  //   text: (
  //     <Text
  //       id="blocks.encodermotor.angle"
  //       defaultMessage="encoder motor [MOTOR] angle"
  //     />
  //   ),
  //   output: 'number',
  //   inputs: {
  //     MOTOR: {
  //       menu: 'EncoderMotors',
  //     },
  //   },
  //   mpy(_, args, defs) {},
  // },
  {
    id: 'pulse',
    text: (
      <Text
        id="blocks.encodermotor.pulse"
        defaultMessage="encoder motor [MOTOR] pulses"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
    },
    mpy(_, args, defs) {
      const code = `encodermotor_${args.MOTOR}.pulse_count`;
      return [code];
    },
  },
  // {
  //   id: 'state',
  //   text: (
  //     <Text
  //       id="blocks.encodermotor.state"
  //       defaultMessage="encoder motor [MOTOR] [STATE]?"
  //     />
  //   ),
  //   output: 'boolean',
  //   inputs: {
  //     MOTOR: {
  //       menu: 'EncoderMotors',
  //     },
  //     STATE: {
  //       menu: [
  //         [
  //           <Text
  //             id="blocks.encodermotor.stateIdle"
  //             defaultMessage="idle"
  //           />,
  //           '0',
  //         ],
  //         [
  //           <Text
  //             id="blocks.encodermotor.stateRunning"
  //             defaultMessage="running"
  //           />,
  //           '123',
  //         ],
  //         [
  //           <Text
  //             id="blocks.encodermotor.stateReached"
  //             defaultMessage="done"
  //           />,
  //           '4',
  //         ],
  //       ],
  //     },
  //   },
  //   mpy(_, args, defs) {},
  // },
  // 内嵌积木
  {
    id: 'speedvalue',
    shadow: true,
    output: 'number',
    inputs: {
      SPEED: {
        type: 'slider',
        defaultValue: 100,
        min: 0,
        max: 100,
      },
    },
    mpy(_, args) {
      return [args.SPEED || 0];
    },
  },
];

export const menus = {
  AllEncoderMotors: {
    items: [
      ['E0', '0'],
      ['E1', '1'],
      ['E2', '2'],
      ['E3', '3'],
      [
        <Text
          id="blocks.encodermotor.all"
          defaultMessage="all"
        />,
        'all',
      ],
    ],
  },
  EncoderMotors: {
    items: [
      ['E0', '0'],
      ['E1', '1'],
      ['E2', '2'],
      ['E3', '3'],
    ],
  },
  RotationDirection: {
    type: 'number',
    inputMode: true,
    defaultValue: '1',
    items: [
      [
        <Text
          id="blocks.encodermotor.forward"
          defaultMessage="forward"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.encodermotor.reverse"
          defaultMessage="reverse"
        />,
        '-1',
      ],
    ],
  },
};
