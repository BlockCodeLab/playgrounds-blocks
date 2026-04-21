import { Text } from '@blockcode/core';
import feature from '../feature.png';

import sengo1colorArduino from '../assets/Sengo1Color-arduino.bcp';
import sengo1colorEsp32 from '../assets/Sengo1Color-esp32.bcp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const lessons = {
  'sentry-example1': {
    title: (
      <Text
        id="blocks.sentry.lessonTitle1"
        defaultMessage="Sengo1 Color"
      />
    ),
    image: feature,
    project(meta) {
      if (isArduino(meta)) return sengo1colorArduino;
      return sengo1colorEsp32;
    },
  },
};
