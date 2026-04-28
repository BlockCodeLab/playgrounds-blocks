import { Text } from '@blockcode/core';
import feature from './feature.svg';

import exmpleArduino from './assets/esp32c2-mqtt.bcp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const lessons = {
  'c2mqtt-example': {
    title: (
      <Text
        id="blocks.c2mqtt.lessonTitle"
        defaultMessage="ESP32C2 MQTT Example"
      />
    ),
    image: feature,
    project(meta) {
      if (isArduino(meta)) {
        return exmpleArduino;
      }
    },
  },
};
