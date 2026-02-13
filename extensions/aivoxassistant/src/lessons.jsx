import { Text } from '@blockcode/core';
import feature from './feature.svg';

import exmpleArduino from './assets/aivoxassistant-arduino.bcp';
import exmpleEsp32 from './assets/aivoxassistant-esp32.bcp';
import exmpleIotBit from './assets/aivoxassistant-iotbit.bcp';
import knowledge from './assets/knowledge.png';
import xiaozhi from './assets/xiaozhi.png';

export const lessons = {
  'aivoxassistant-help': {
    title: (
      <Text
        id="blocks.aivoxassistant.lessonTitle"
        defaultMessage="AI Vox Assistant Help"
      />
    ),
    image: feature,
    project(meta) {
      if (meta.editor === '@blockcode/gui-arduino') {
        return exmpleArduino;
      }
      if (meta.editor === '@blockcode/gui-esp32') {
        return exmpleEsp32;
      }
      if (meta.editor === '@emakefun/gui-iotbit') {
        return exmpleIotBit;
      }
      return;
    },
    pages: [
      {
        title: (
          <Text
            id="blocks.aivoxassistant.lessonPage1.title"
            defaultMessage="Peripheral Control Commands"
          />
        ),
        image: knowledge,
        text: (
          <Text
            id="blocks.aivoxassistant.lessonPage1.text"
            defaultMessage="Create a new Excel file, enter the peripheral control commands for this example in the format shown above, and then save it."
          />
        ),
      },
      {
        title: (
          <Text
            id="blocks.aivoxassistant.lessonPage2.title"
            defaultMessage="Import to Xiaozhi Knowledge Base"
          />
        ),
        image: xiaozhi,
        text: (
          <Text
            id="blocks.aivoxassistant.lessonPage2.text"
            defaultMessage='Import the "Peripheral Control Commands" into the knowledge base of the Xiaozhi backend at xiaozhi.me.'
          />
        ),
      },
    ],
  },
};
