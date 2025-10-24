import { MathUtils } from '@blockcode/utils';
import { ClangGenerator } from './generator';

const proto = ClangGenerator.prototype;

// NOTE[octave]
// NOTE = NOTES[m % 12]
// octave = Math.floor(m / 12) - 1
const NOTES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

proto['note'] = function (block) {
  const noteNum = block.getFieldValue('NOTE');
  const note = NOTES[noteNum % 12];
  const octave = MathUtils.clamp(Math.floor(noteNum / 12) - 1, 0, 9);
  const code = this.quote_(note + octave);
  return [code, this.ORDER_ATOMIC];
};
