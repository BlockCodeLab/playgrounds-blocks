import sentryPy from './sentry.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) return [];

  return [
    {
      name: 'sentry.py',
      type: 'text/x-python',
      uri: sentryPy,
    },
  ];
};
