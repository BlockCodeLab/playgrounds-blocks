import { Text } from '@blockcode/core';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

const SetSentryParam = (gen) => {
  let code = '';
  code +=
    'void SetSentryParam(int type, uint16_t d1, uint16_t d2, uint16_t d3, uint16_t d4, uint16_t d5, int id=1) {\n';
  code += '  sentry_object_t param;\n';
  code += '  param.result_data1 = d1;\n';
  code += '  param.result_data2 = d2;\n';
  code += '  param.result_data3 = d3;\n';
  code += '  param.result_data4 = d4;\n';
  code += '  param.result_data5 = d5;\n';
  code += '  sentry.SetParam(type, &param, id);\n';
  code += '}\n';
  gen.definitions_['declare_SetSentryParam'] =
    'void SetSentryParam(int type, uint16_t d1, uint16_t d2, uint16_t d3, uint16_t d4, uint16_t d5, int id=1);';
  gen.definitions_['SetSentryParam'] = code;
};

export const blocks = (meta) => [
  isArduino(meta)
    ? {
        id: 'addr',
        text: (
          <Text
            id="blocks.sentry.addr"
            defaultMessage="set [MODEL] I2C address [ADDR]"
          />
        ),
        inputs: {
          MODEL: {
            menu: ['Sengo1', 'Sengo2', 'Sentry1', 'Sentry2', 'Sentry3'],
          },
          ADDR: {
            menu: [
              ['0×60', '0x60'],
              ['0×61', '0x61'],
              ['0×62', '0x62'],
              ['0×63', '0x63'],
            ],
          },
        },
        ino(block) {
          const model = block.getFieldValue('MODEL');
          const addr = block.getFieldValue('ADDR');
          this.definitions_['include_wire'] = '#include <Wire.h>';
          this.definitions_['include_sentry'] = '#include <Sentry.h>';
          this.definitions_['variable_sentry_def'] = `typedef ${model} Sentry;`;
          this.definitions_['variable_sentry'] = `Sentry sentry(${addr});`;
          this.definitions_['setup_wire'] = 'Wire.begin();';
          this.definitions_['setup_sentry'] = 'sentry.begin(&Wire);';
          return '';
        },
      }
    : {
        id: 'init',
        text: (
          <Text
            id="blocks.sentry.init"
            defaultMessage="set [MODEL] pins SCL:[SCL] SDA:[SDA] I2C address [ADDR]"
          />
        ),
        inputs: {
          MODEL: {
            menu: ['Sengo1', 'Sengo2', 'Sentry1', 'Sentry2', 'Sentry3'],
          },
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
          ADDR: {
            menu: [
              ['0×60', '0x60'],
              ['0×61', '0x61'],
              ['0×62', '0x62'],
              ['0×63', '0x63'],
            ],
          },
        },
        mpy(block) {
          const model = block.getFieldValue('MODEL');
          const scl = block.getFieldValue('SCL');
          const sda = block.getFieldValue('SDA');
          const addr = block.getFieldValue('ADDR');
          this.definitions_['import_pin'] = 'from machine import Pin';
          this.definitions_['import_i2c'] = 'from machine import I2C';
          this.definitions_['sen_cam'] = `sen_cam = sentry.${model}(address=${addr})`;
          this.definitions_['sen_cam_begin'] = `sen_cam.begin(I2C(1, scl=Pin(${scl}), sda=Pin(${sda})))`;
          return '';
        },
      },
  {
    id: 'open',
    text: (
      <Text
        id="blocks.sentry.open"
        defaultMessage="[STATE] [VISION] algorithm"
      />
    ),
    inputs: {
      STATE: {
        menu: [
          [
            <Text
              id="blocks.sentry.stateOn"
              defaultMessage="enable"
            />,
            'Begin',
          ],
          [
            <Text
              id="blocks.sentry.stateOff"
              defaultMessage="disable"
            />,
            'End',
          ],
        ],
      },
      VISION: {
        menu: 'Vision',
      },
    },
    ino(block) {
      const state = block.getFieldValue('STATE');
      const vision = block.getFieldValue('VISION');
      const code = `sentry.Vision${state}(Sentry::kVision${vision});\n`;
      return code;
    },
    mpy(block) {
      const state = block.getFieldValue('STATE');
      const vision = block.getFieldValue('VISION');
      const code = `sen_cam.Vision${state}(sen_cam.kVision${vision})\n`;
      return code;
    },
  },
  '---',
  {
    id: 'paramNum',
    text: (
      <Text
        id="blocks.sentry.paramNum"
        defaultMessage="set [VISION] maximum detection limit to [NUM]"
      />
    ),
    inputs: {
      VISION: {
        menu: 'Vision',
      },
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino(block) {
      const vision = block.getFieldValue('VISION');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sentry.SetParamNum(Sentry::kVision${vision}, ${num});\n`;
      return code;
    },
    mpy(block) {
      const vision = block.getFieldValue('VISION');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sen_cam.SetParamNum(sen_cam.kVision${vision}, ${num})\n`;
      return code;
    },
  },
  {
    id: 'paramColor',
    text: (
      <Text
        id="blocks.sentry.paramColor"
        defaultMessage="set Color #[NUM] paramset x-coord:[CX] y-coord:[CY] width:[W] height:[H]"
      />
    ),
    inputs: {
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      CX: {
        type: 'positive_integer',
        defaultValue: 50,
      },
      CY: {
        type: 'positive_integer',
        defaultValue: 50,
      },
      W: {
        type: 'positive_integer',
        defaultValue: 3,
      },
      H: {
        type: 'positive_integer',
        defaultValue: 4,
      },
    },
    ino(block) {
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const cx = this.valueToCode(block, 'CX', this.ORDER_NONE);
      const cy = this.valueToCode(block, 'CY', this.ORDER_NONE);
      const width = this.valueToCode(block, 'W', this.ORDER_NONE);
      const height = this.valueToCode(block, 'H', this.ORDER_NONE);
      SetSentryParam(this);
      const code = `SetSentryParam(Sentry::kVisionColor, ${cx},${cy},${width},${height},0, ${num});\n`;
      return code;
    },
    mpy(block) {
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const cx = this.valueToCode(block, 'CX', this.ORDER_NONE);
      const cy = this.valueToCode(block, 'CY', this.ORDER_NONE);
      const width = this.valueToCode(block, 'W', this.ORDER_NONE);
      const height = this.valueToCode(block, 'H', this.ORDER_NONE);
      const code = `sen_cam.SetParam(sen_cam.kVisionColor, (${cx},${cy},${width},${height},0), ${num})\n`;
      return code;
    },
  },
  {
    id: 'paramBlob',
    text: (
      <Text
        id="blocks.sentry.paramBlob"
        defaultMessage="set Blob #[NUM] paramset min-width:[W] min-height:[H] color:[RES]"
      />
    ),
    inputs: {
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      W: {
        type: 'positive_integer',
        defaultValue: 3,
      },
      H: {
        type: 'positive_integer',
        defaultValue: 4,
      },
      RES: {
        menu: 'Colors',
        defaultValue: 3,
      },
    },
    ino(block) {
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const width = this.valueToCode(block, 'W', this.ORDER_NONE);
      const height = this.valueToCode(block, 'H', this.ORDER_NONE);
      const res = block.getFieldValue('RES');
      SetSentryParam(this);
      const code = `SetSentryParam(Sentry::kVisionBlob, 0,0,${width},${height},${res}, ${num});\n`;
      return code;
    },
    mpy(block) {
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const width = this.valueToCode(block, 'W', this.ORDER_NONE);
      const height = this.valueToCode(block, 'H', this.ORDER_NONE);
      const res = block.getFieldValue('RES');
      const code = `sen_cam.SetParam(sen_cam.kVisionBlob, (0,0,${width},${height},${res}), ${num})\n`;
      return code;
    },
  },
  {
    id: 'paramLearning',
    text: (
      <Text
        id="blocks.sentry.paramLearning"
        defaultMessage="[VISION] algorithm [MODE] ID [NUM]"
      />
    ),
    inputs: {
      VISION: {
        menu: 'VisionLearning',
      },
      MODE: {
        menu: [
          [
            <Text
              id="blocks.sentry.learningSave"
              defaultMessage="learn and assign"
            />,
            '100',
          ],
          [
            <Text
              id="blocks.sentry.learningRemove"
              defaultMessage="delete data"
            />,
            '0',
          ],
        ],
      },
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino(block) {
      const vision = block.getFieldValue('VISION');
      const mode = block.getFieldValue('MODE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      SetSentryParam(this);
      const code = `SetSentryParam(Sentry::kVision${vision}, 0,0,0,0,${mode}, ${num});\n`;
      return code;
    },
    mpy(block) {
      const vision = block.getFieldValue('VISION');
      const mode = block.getFieldValue('MODE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sen_cam.SetParam(sen_cam.kVision${vision}, (0,0,0,0,${mode}), ${num})\n`;
      return code;
    },
  },
  '---',
  {
    id: 'resultNum',
    text: (
      <Text
        id="blocks.sentry.resultNum"
        defaultMessage="number of [VISION] detected objects"
      />
    ),
    output: 'number',
    inputs: {
      VISION: {
        menu: 'Vision',
      },
    },
    ino(block) {
      const vision = block.getFieldValue('VISION');
      const code = `sentry.GetValue(Sentry::kVision${vision}, kStatus)`;
      return [code];
    },
    mpy(block) {
      const vision = block.getFieldValue('VISION');
      const code = `sen_cam.GetValue(sen_cam.kVision${vision}, sen_cam.kStatus)`;
      return [code];
    },
  },
  {
    id: 'result',
    text: (
      <Text
        id="blocks.sentry.result"
        defaultMessage="[VISION] algorithm [TYPE] of #[NUM] object"
      />
    ),
    output: 'number',
    inputs: {
      VISION: {
        menu: 'VisionValue',
      },
      TYPE: {
        menu: [
          ['x', 'kXValue'],
          ['y', 'kYValue'],
          [
            <Text
              id="blocks.sentry.resultTypeWidth"
              defaultMessage="width"
            />,
            'kWidthValue',
          ],
          [
            <Text
              id="blocks.sentry.resultTypeHeight"
              defaultMessage="height"
            />,
            'kHeightValue',
          ],
          [
            <Text
              id="blocks.sentry.resultTypeLabel"
              defaultMessage="label"
            />,
            'kLabel',
          ],
        ],
      },
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino(block) {
      const vision = block.getFieldValue('VISION');
      const type = block.getFieldValue('TYPE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sentry.GetValue(Sentry::kVision${vision}, ${type}, ${num})`;
      return [code];
    },
    mpy(block) {
      const vision = block.getFieldValue('VISION');
      const type = block.getFieldValue('TYPE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sen_cam.GetValue(sen_cam.kVision${vision}, sen_cam.${type}, ${num})`;
      return [code];
    },
  },
  {
    id: 'resultColor',
    text: (
      <Text
        id="blocks.sentry.resultColor"
        defaultMessage="Color algorithm [TYPE] of #[NUM] object"
      />
    ),
    output: 'number',
    inputs: {
      TYPE: {
        menu: 'ColorValue',
      },
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino(block) {
      const type = block.getFieldValue('TYPE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sentry.GetValue(Sentry::kVisionColor, ${type}, ${num})`;
      return [code];
    },
    mpy(block) {
      const type = block.getFieldValue('TYPE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sen_cam.GetValue(sen_cam.kVisionColor, sen_cam.${type}, ${num})`;
      return [code];
    },
  },
  {
    id: 'resultLine',
    text: (
      <Text
        id="blocks.sentry.resultLine"
        defaultMessage="Line algorithm [TYPE] of #[NUM] line"
      />
    ),
    output: 'number',
    inputs: {
      TYPE: {
        menu: [
          ['x1', 'kXValue'],
          ['y1', 'kYValue'],
          ['x2', 'kWidthValue'],
          ['y2', 'kHeightValue'],
          [
            <Text
              id="blocks.sentry.resultLabelAngle"
              defaultMessage="angle"
            />,
            'kLabelValue',
          ],
        ],
      },
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino(block) {
      const type = block.getFieldValue('TYPE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sentry.GetValue(Sentry::kVisionLine, ${type}, ${num})`;
      return [code];
    },
    mpy(block) {
      const type = block.getFieldValue('TYPE');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `sen_cam.GetValue(sen_cam.kVisionLine, sen_cam.${type}, ${num})`;
      return [code];
    },
  },
  {
    id: 'resultQRCode',
    text: (
      <Text
        id="blocks.sentry.resultQRCode"
        defaultMessage="String of QR code"
      />
    ),
    output: 'string',
    ino(block) {
      const code = `String(sentry.GetQrCodeValue())`;
      return [code];
    },
    mpy(block) {
      const code = `sen_cam.GetQrCodeValue()`;
      return [code];
    },
  },
  '---',
  {
    id: 'resultIsColor',
    text: (
      <Text
        id="blocks.sentry.resultIsColor"
        defaultMessage="Color detected #[NUM] object is [RES]?"
      />
    ),
    output: 'boolean',
    inputs: {
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      RES: {
        menu: 'Colors',
      },
    },
    ino(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sentry.GetValue(Sentry::kVisionColor, kLabel, ${num}) == ${res})`;
      return [code];
    },
    mpy(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sen_cam.GetValue(sen_cam.kVisionColor, sen_cam.kLabel, ${num}) == ${res})`;
      return [code];
    },
  },
  {
    id: 'resultIsBlob',
    text: (
      <Text
        id="blocks.sentry.resultIsBlob"
        defaultMessage="Blob detected #[NUM] object is [RES]?"
      />
    ),
    output: 'boolean',
    inputs: {
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      RES: {
        menu: 'Colors',
        defaultValue: 3,
      },
    },
    ino(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sentry.GetValue(Sentry::kVisionBlob, kLabel, ${num}) == ${res})`;
      return [code];
    },
    mpy(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sen_cam.GetValue(sen_cam.kVisionBlob, sen_cam.kLabel, ${num}) == ${res})`;
      return [code];
    },
  },
  {
    id: 'resultIs20Classes',
    text: (
      <Text
        id="blocks.sentry.resultIs20Classes"
        defaultMessage="20Classes detected #[NUM] object is [RES]?"
      />
    ),
    output: 'boolean',
    inputs: {
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      RES: {
        menu: 'Objects',
      },
    },
    ino(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sentry.GetValue(Sentry::kVision20Classes, kLabel, ${num}) == ${res})`;
      return [code];
    },
    mpy(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sen_cam.GetValue(sen_cam.kVision20Classes, sen_cam.kLabel, ${num}) == ${res})`;
      return [code];
    },
  },
  {
    id: 'resultIsCard',
    text: (
      <Text
        id="blocks.sentry.resultIsCard"
        defaultMessage="20Classes detected #[NUM] object is [RES]?"
      />
    ),
    output: 'boolean',
    inputs: {
      NUM: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      RES: {
        menu: 'Cards',
      },
    },
    ino(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sentry.GetValue(Sentry::kVisionCard, kLabel, ${num}) == ${res})`;
      return [code];
    },
    mpy(block) {
      const res = block.getFieldValue('RES');
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `(sen_cam.GetValue(sen_cam.kVisionCard, sen_cam.kLabel, ${num}) == ${res})`;
      return [code];
    },
  },
];

export const menus = {
  Vision: {
    items: [
      [
        <Text
          id="blocks.sentry.visionColor"
          defaultMessage="Color"
        />,
        'Color',
      ],
      [
        <Text
          id="blocks.sentry.visionBlob"
          defaultMessage="Blob"
        />,
        'Blob',
      ],
      [
        <Text
          id="blocks.sentry.visionBall"
          defaultMessage="Ball"
        />,
        'Ball',
      ],
      [
        <Text
          id="blocks.sentry.visionLine"
          defaultMessage="Line"
        />,
        'Line',
      ],
      [
        <Text
          id="blocks.sentry.visionAprilTag"
          defaultMessage="Apriltag"
        />,
        'AprilTag',
      ],
      [
        <Text
          id="blocks.sentry.visionLearning"
          defaultMessage="Learning"
        />,
        'Learning',
      ],
      [
        <Text
          id="blocks.sentry.visionCard"
          defaultMessage="Card"
        />,
        'Card',
      ],
      [
        <Text
          id="blocks.sentry.visionBody"
          defaultMessage="Body"
        />,
        'Body',
      ],
      [
        <Text
          id="blocks.sentry.visionFace"
          defaultMessage="Face"
        />,
        'Face',
      ],
      [
        <Text
          id="blocks.sentry.visionQrCode"
          defaultMessage="QR code"
        />,
        'QrCode',
      ],
      [
        <Text
          id="blocks.sentry.vision20Classes"
          defaultMessage="20 classes objects"
        />,
        '20Classes',
      ],
      [
        <Text
          id="blocks.sentry.visionMotionDetect"
          defaultMessage="Motion"
        />,
        'MotionDetect',
      ],
    ],
  },
  VisionValue: {
    items: [
      [
        <Text
          id="blocks.sentry.visionColor"
          defaultMessage="Color"
        />,
        'Color',
      ],
      [
        <Text
          id="blocks.sentry.visionBlob"
          defaultMessage="Blob"
        />,
        'Blob',
      ],
      [
        <Text
          id="blocks.sentry.visionBall"
          defaultMessage="Ball"
        />,
        'Ball',
      ],
      [
        <Text
          id="blocks.sentry.visionAprilTag"
          defaultMessage="Apriltag"
        />,
        'AprilTag',
      ],
      [
        <Text
          id="blocks.sentry.visionLearning"
          defaultMessage="Learning"
        />,
        'Learning',
      ],
      [
        <Text
          id="blocks.sentry.visionCard"
          defaultMessage="Card"
        />,
        'Card',
      ],
      [
        <Text
          id="blocks.sentry.visionBody"
          defaultMessage="Body"
        />,
        'Body',
      ],
      [
        <Text
          id="blocks.sentry.visionFace"
          defaultMessage="Face"
        />,
        'Face',
      ],
      [
        <Text
          id="blocks.sentry.visionQrCode"
          defaultMessage="QRCode"
        />,
        'QrCode',
      ],
      [
        <Text
          id="blocks.sentry.vision20Classes"
          defaultMessage="20Classes"
        />,
        '20Classes',
      ],
      [
        <Text
          id="blocks.sentry.visionMotionDetect"
          defaultMessage="Motion"
        />,
        'MotionDetect',
      ],
    ],
  },
  VisionLearning: {
    items: [
      [
        <Text
          id="blocks.sentry.visionLearning"
          defaultMessage="Learning"
        />,
        'Learning',
      ],
      [
        <Text
          id="blocks.sentry.visionFace"
          defaultMessage="Face"
        />,
        'Face',
      ],
    ],
  },
  ColorValue: {
    items: [
      [
        <Text
          id="blocks.sentry.resultColorR"
          defaultMessage="R channel"
        />,
        'kRValue',
      ],
      [
        <Text
          id="blocks.sentry.resultColorG"
          defaultMessage="G channel"
        />,
        'kGValue',
      ],
      [
        <Text
          id="blocks.sentry.resultColorB"
          defaultMessage="B channel"
        />,
        'kBValue',
      ],
      [
        <Text
          id="blocks.sentry.resultTypeLabel"
          defaultMessage="label"
        />,
        'kLabelValue',
      ],
    ],
  },
  Colors: {
    items: [
      [
        <Text
          id="blocks.sentry.resultColorBlack"
          defaultMessage="black"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.sentry.resultColorWhite"
          defaultMessage="white"
        />,
        '2',
      ],
      [
        <Text
          id="blocks.sentry.resultColorRed"
          defaultMessage="red"
        />,
        '3',
      ],
      [
        <Text
          id="blocks.sentry.resultColorGreen"
          defaultMessage="green"
        />,
        '4',
      ],
      [
        <Text
          id="blocks.sentry.resultColorBlue"
          defaultMessage="blue"
        />,
        '5',
      ],
      [
        <Text
          id="blocks.sentry.resultColorYellow"
          defaultMessage="yellow"
        />,
        '6',
      ],
    ],
  },
  Objects: {
    items: [
      [
        <Text
          id="blocks.sentry.resultObjectAirplane"
          defaultMessage="airplane"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectBicycle"
          defaultMessage="bicycle"
        />,
        '2',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectBird"
          defaultMessage="bird"
        />,
        '3',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectBoat"
          defaultMessage="boat"
        />,
        '4',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectBottle"
          defaultMessage="bottle"
        />,
        '5',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectBus"
          defaultMessage="bus"
        />,
        '6',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectCar"
          defaultMessage="car"
        />,
        '7',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectCat"
          defaultMessage="cat"
        />,
        '8',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectChair"
          defaultMessage="chair"
        />,
        '9',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectCow"
          defaultMessage="cow"
        />,
        '10',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectTable"
          defaultMessage="dining table"
        />,
        '11',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectDog"
          defaultMessage="dog"
        />,
        '12',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectHorse"
          defaultMessage="horse"
        />,
        '13',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectMotorbike"
          defaultMessage="motorbike"
        />,
        '14',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectPerson"
          defaultMessage="person"
        />,
        '15',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectPlant"
          defaultMessage="potted plant"
        />,
        '16',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectSheep"
          defaultMessage="sheep"
        />,
        '17',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectSofa"
          defaultMessage="sofa"
        />,
        '18',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectTrain"
          defaultMessage="train"
        />,
        '19',
      ],
      [
        <Text
          id="blocks.sentry.resultObjectMonitor"
          defaultMessage="tv monitor"
        />,
        '20',
      ],
    ],
  },
  Cards: {
    items: [
      [
        <Text
          id="blocks.sentry.resultCardForward"
          defaultMessage="forward"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.sentry.resultCardLeft"
          defaultMessage="left"
        />,
        '2',
      ],
      [
        <Text
          id="blocks.sentry.resultCardRight"
          defaultMessage="right"
        />,
        '3',
      ],
      [
        <Text
          id="blocks.sentry.resultCardTurn"
          defaultMessage="turn around"
        />,
        '4',
      ],
      [
        <Text
          id="blocks.sentry.resultCardPark"
          defaultMessage="park"
        />,
        '5',
      ],
      [
        <Text
          id="blocks.sentry.resultCardGreenLight"
          defaultMessage="green light"
        />,
        '6',
      ],
      [
        <Text
          id="blocks.sentry.resultCardRedLight"
          defaultMessage="red light"
        />,
        '7',
      ],
      [
        <Text
          id="blocks.sentry.resultCardSpeed40"
          defaultMessage="speed 40"
        />,
        '8',
      ],
      [
        <Text
          id="blocks.sentry.resultCardSpeed60"
          defaultMessage="speed 60"
        />,
        '9',
      ],
      [
        <Text
          id="blocks.sentry.resultCardSpeed80"
          defaultMessage="speed 80"
        />,
        '10',
      ],
      ['✓', '11'],
      ['×', '12'],
      ['○', '13'],
      ['□', '14'],
      ['△', '15'],
      ['+', '16'],
      ['-', '17'],
      ['÷', '18'],
      ['=', '19'],
      // ['0', '0'],
      // ['1', '1'],
      // ['2', '2'],
      // ['3', '3'],
      // ['4', '4'],
      // ['5', '5'],
      // ['6', '6'],
      // ['7', '7'],
      // ['8', '8'],
      // ['9', '9'],
    ],
  },
};
