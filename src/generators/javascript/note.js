import { MathUtils } from '@blockcode/utils';
import { JavaScriptGenerator } from './generator';

const proto = JavaScriptGenerator.prototype;

// NOTE[octave]
// NOTE = NOTES[m % 12]
// octave = Math.floor(m / 12) - 1
const NOTES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

const getNoteNum = (noteStr) => {
  const note = noteStr[1] === '#' ? noteStr.slice(0, 2) : noteStr.slice(0, 1);
  const octave = isNaN(noteStr.slice(-1)) ? 0 : parseInt(noteStr.slice(note.length));
  return NOTES.indexOf(note) + 12 * (octave + 1);
};

proto['note'] = function (block) {
  let noteNum = block.getFieldValue('NOTE');
  if (isNaN(noteNum)) {
    noteNum = getNoteNum(noteNum);
  }
  const note = NOTES[noteNum % 12];
  const octave = MathUtils.clamp(Math.floor(noteNum / 12) - 1, 0, 9);
  const code = this.quote_(note + octave);
  return [code, this.ORDER_ATOMIC];
};
