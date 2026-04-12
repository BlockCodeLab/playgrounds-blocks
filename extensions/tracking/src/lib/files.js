import fiveTrackerPyUri from './files/five_line_tracker.py';
import fiveTrackerHUri from './files/five_line_tracker.h';
import fiveTrackerCppUri from './files/five_line_tracker.cpp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'five_line_tracker.h',
        type: 'text/x-c',
        uri: fiveTrackerHUri,
      },
      {
        name: 'five_line_tracker.cpp',
        type: 'text/x-c',
        uri: fiveTrackerCppUri,
      },
    ];
  }

  return [
    {
      name: 'five_line_tracker',
      type: 'text/x-python',
      uri: fiveTrackerPyUri,
    },
  ];
};
