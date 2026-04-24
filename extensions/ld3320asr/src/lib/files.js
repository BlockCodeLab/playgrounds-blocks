import speechRecognizerH from './files/speech_recognizer.h';
import speechRecognizerCpp from './files/speech_recognizer.cpp';
import speechRecognizerPy from './files/speech_recognizer.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta))
    return [
      {
        header: true,
        name: 'speech_recognizer.h',
        type: 'text/x-c',
        uri: speechRecognizerH,
      },
      {
        name: 'speech_recognizer.cpp',
        type: 'text/x-c',
        uri: speechRecognizerCpp,
      },
    ];

  return [
    {
      name: 'speech_recognizer.py',
      type: 'text/x-python',
      uri: speechRecognizerPy,
    },
  ];
};
