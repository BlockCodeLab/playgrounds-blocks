import { Text } from '@blockcode/core';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

const data = new Date();

export const blocks = (meta) => [
  isArduino(meta)
    ? {
        id: 'init',
        text: (
          <Text
            id="blocks.rtci2c.initRtc"
            defaultMessage="init [DRV] RTC"
          />
        ),
        inputs: {
          DRV: {
            menu: ['DS1307', 'DS3231', 'DS3232', 'PCF8563', 'PCF8523', 'MCP7940'],
          },
        },
        ino(block) {
          const drv = block.getFieldValue('DRV');
          this.definitions_['include_rtc'] = `#include <I2C_RTC.h>`;
          this.definitions_[`variable_rtc`] = `${drv} rtc;`;
          this.definitions_[`setup_rtc`] = `rtc.begin();`;
          this.definitions_['setup_rtc_start'] =
            `if (!rtc.isRunning()) {\n    rtc.setDateTime(__DATE__, __TIME__);\n    rtc.startClock();\n  }`;
          return '';
        },
      }
    : {
        id: 'init',
        text: (
          <Text
            id="blocks.rtci2c.init"
            defaultMessage="set [DRV] RTC pins SCL:[SCL] SDA:[SDA]"
          />
        ),
        inputs: {
          DRV: {
            menu: ['DS1307', 'DS3231', 'DS3232', 'PCF8563', 'PCF8523', 'MCP7940'],
          },
          SCL: meta.boardPins
            ? { menu: meta.boardPins.all }
            : {
                type: 'integer',
                defaultValue: '2',
              },
          SDA: meta.boardPins
            ? { menu: meta.boardPins.all }
            : {
                type: 'integer',
                defaultValue: '3',
              },
        },
        mpy(block) {
          const drv = block.getFieldValue('DRV');
          const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
          const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);
          this.definitions_['import_i2c'] = `from machine import I2C`;
          this.definitions_['import_Pin'] = `from machine import Pin`;
          this.definitions_['rtc_init'] = `rtc = rtci2c.${drv}(I2C(1, scl=Pin(${scl}), sda=Pin(${sda})))`;
          return '';
        },
      },
  {
    id: 'setTime',
    text: (
      <Text
        id="blocks.rtci2c.setTime"
        defaultMessage="set time [YEAR]-[MONTH]-[DAY] [HOUR]:[MINUTE]:[SECOND]"
      />
    ),
    inputs: {
      YEAR: {
        type: 'positive_integer',
        defaultValue: data.getFullYear(),
      },
      MONTH: {
        type: 'positive_integer',
        defaultValue: data.getMonth() + 1,
      },
      DAY: {
        type: 'positive_integer',
        defaultValue: data.getDate(),
      },
      HOUR: {
        type: 'positive_integer',
        defaultValue: data.getHours(),
      },
      MINUTE: {
        type: 'positive_integer',
        defaultValue: data.getMinutes(),
      },
      SECOND: {
        type: 'positive_integer',
        defaultValue: data.getSeconds(),
      },
    },
    ino(block) {
      const year = this.valueToCode(block, 'YEAR', this.ORDER_NONE);
      const month = this.valueToCode(block, 'MONTH', this.ORDER_NONE);
      const day = this.valueToCode(block, 'DAY', this.ORDER_NONE);
      const hour = this.valueToCode(block, 'HOUR', this.ORDER_NONE);
      const minute = this.valueToCode(block, 'MINUTE', this.ORDER_NONE);
      const second = this.valueToCode(block, 'SECOND', this.ORDER_NONE);
      let code = '';
      code += `rtc.setTime(${hour}, ${minute}, ${second});\n`;
      code += `rtc.setDate(${day}, ${month}, ${year});\n`;
      return code;
    },
    mpy(block) {
      const year = this.valueToCode(block, 'YEAR', this.ORDER_NONE);
      const month = this.valueToCode(block, 'MONTH', this.ORDER_NONE);
      const day = this.valueToCode(block, 'DAY', this.ORDER_NONE);
      const hour = this.valueToCode(block, 'HOUR', this.ORDER_NONE);
      const minute = this.valueToCode(block, 'MINUTE', this.ORDER_NONE);
      const second = this.valueToCode(block, 'SECOND', this.ORDER_NONE);
      let code = '';
      code += `rtc.set_time(${year}, ${month}, ${day}, ${hour}, ${minute}, ${second})\n`;
      return code;
    },
  },
  {
    id: 'getTime',
    text: (
      <Text
        id="blocks.rtci2c.getTime"
        defaultMessage="[OPTION]"
      />
    ),
    output: 'number',
    inputs: {
      OPTION: {
        defaultValue: 'year',
        menu: [
          [
            <Text
              id="blocks.rtci2c.optionYear"
              defaultMessage="year"
            />,
            'year',
          ],
          [
            <Text
              id="blocks.rtci2c.optionMonth"
              defaultMessage="month"
            />,
            'month',
          ],
          [
            <Text
              id="blocks.rtci2c.optionDay"
              defaultMessage="day"
            />,
            'day',
          ],
          [
            <Text
              id="blocks.rtci2c.optionWeekday"
              defaultMessage="day of week"
            />,
            'week',
          ],
          [
            <Text
              id="blocks.rtci2c.optionHour"
              defaultMessage="hour"
            />,
            'hours',
          ],
          [
            <Text
              id="blocks.rtci2c.optionMinute"
              defaultMessage="minute"
            />,
            'minutes',
          ],
          [
            <Text
              id="blocks.rtci2c.optionSecond"
              defaultMessage="second"
            />,
            'seconds',
          ],
        ],
      },
    },
    ino(block) {
      const option = block.getFieldValue('OPTION');
      const code = `rtc.get${option.charAt(0).toUpperCase() + option.slice(1)}()`;
      return [code];
    },
    mpy(block) {
      const option = block.getFieldValue('OPTION');
      const indexes = {
        year: 0,
        month: 1,
        day: 2,
        week: 6,
        hours: 3,
        minutes: 4,
        seconds: 5,
      };
      const code = `rtc.read_time()[${indexes[option]}]`;
      return [code];
    },
  },
];
