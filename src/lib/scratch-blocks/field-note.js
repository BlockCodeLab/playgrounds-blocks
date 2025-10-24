import { ScratchBlocks } from './scratch-blocks';
import { Tone } from '../runtime/tone';

// Given the MIDI NoteOn number m, the frequency of the note is normally
// 440*2^((m-69)/12) Hz
// NOTE[octave]
// NOTE = NOTES[m % 12]
// octave = Math.floor(m / 12) - 1
const NOTES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

// 添加音符播放
ScratchBlocks.FieldNote.playNote_ = (noteNum /*, id*/) => {
  const note = NOTES[noteNum % 12];
  const octave = Math.floor(noteNum / 12) - 1;
  const noteStr = note + octave + ':2';
  ScratchBlocks.FieldNote.tone_.play(noteStr);
};

ScratchBlocks.FieldNote.tone_ = new Tone();
