import { Text } from '@blockcode/core';
import feature from './feature.svg';

import exmpleArduino from './assets/esp32c2-mqtt.bcp';

export const lessons = {
  'c2mqtt-example': {
    title: (
      <Text
        id="blocks.c2mqtt.lessonTitle"
        defaultMessage="ESP32C2 MQTT Exmple"
      />
    ),
    image: feature,
    project(meta) {
      if (meta.editor === '@blockcode/gui-arduino') {
        return exmpleArduino;
      }
    },
  },
};
