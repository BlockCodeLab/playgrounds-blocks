import qmc5883lPy from './qmc5883l.py';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) return [];

  return [
    {
      header: true,
      name: 'qmc5883l.py',
      type: 'text/x-python',
      uri: qmc5883lPy,
    },
  ];
};
