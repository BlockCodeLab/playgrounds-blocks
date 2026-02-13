import { Text } from '@blockcode/core';
import feature from './feature.svg';

import exmple from './assets/aivoxassistant.bcp';
import knowledge from './assets/knowledge.png';
import xiaozhi from './assets/xiaozhi.png';

export const lessons = {
  'aivoxassistant-help': {
    title: (
      <Text
        id="blocks.aivoxassistant.lessonTitle"
        defaultMessage="AI-Vox Assistant Help"
      />
    ),
    image: feature,
    project: exmple,
    pages: [
      {
        title: (
          <Text
            id="blocks.aivoxassistant.lessonPage1.title"
            defaultMessage="AI-Vox Assistant Help"
          />
        ),
        image: knowledge,
        text: (
          <Text
            id="blocks.aivoxassistant.lessonPage1.text"
            defaultMessage="AI-Vox Assistant Help"
          />
        ),
      },
      {
        title: (
          <Text
            id="blocks.aivoxassistant.lessonPage2.title"
            defaultMessage="AI-Vox Assistant Help"
          />
        ),
        image: xiaozhi,
        text: (
          <Text
            id="blocks.aivoxassistant.lessonPage2.text"
            defaultMessage="AI-Vox Assistant Help"
          />
        ),
      },
    ],
  },
};
