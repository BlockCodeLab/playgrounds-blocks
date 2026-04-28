import { Text } from '@blockcode/core';
import feature from './feature.png';

import readExample from './assets/RF-Read-Data.bcp';
import sendExample from './assets/RF-Send-Data.bcp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const lessons = {
  'rfcom-send': {
    title: (
      <Text
        id="blocks.rfcom.lessonTitle1"
        defaultMessage="RF Send Data Example"
      />
    ),
    image: feature,
    project(meta) {
      if (isArduino(meta)) {
        return sendExample;
      }
    },
  },
  'rfcom-read': {
    title: (
      <Text
        id="blocks.rfcom.lessonTitle2"
        defaultMessage="RF Read Data Example"
      />
    ),
    image: feature,
    project(meta) {
      if (isArduino(meta)) {
        return readExample;
      }
    },
  },
};
