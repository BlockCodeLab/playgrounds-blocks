import { Text } from '@blockcode/core';
import feature from './feature.svg';

import asrArduino from './assets/asr-arduino.bcp';
import asrEsp32 from './assets/asr-esp32.bcp';

import keybtnArduino from './assets/asr-keybtn-arduino.bcp';
import keybtnEsp32 from './assets/asr-keybtn-esp32.bcp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const lessons = {
  'asr-example': {
    title: (
      <Text
        id="blocks.ld3320asr.lessonTitle1"
        defaultMessage="Simple ASR"
      />
    ),
    image: feature,
    project(meta) {
      if (isArduino(meta)) return asrArduino;
      return asrEsp32;
    },
  },
  'asr-keybutton-example': {
    title: (
      <Text
        id="blocks.ld3320asr.lessonTitle2"
        defaultMessage="Button Or Keyword Trigger ASR"
      />
    ),
    image: feature,
    project(meta) {
      if (isArduino(meta)) return keybtnArduino;
      return keybtnEsp32;
    },
  },
};
