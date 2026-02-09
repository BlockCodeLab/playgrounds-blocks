import { ScratchBlocks } from './scratch-blocks';
import { Tone } from '../runtime/tone';

// Given the MIDI NoteOn number m, the frequency of the note is normally
// 440*2^((m-69)/12) Hz
// NOTE[octave]
// NOTE = NOTES[m % 12]
// octave = Math.floor(m / 12) - 1
const NOTES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

const getNoteStr = (noteNum) => {
  const note = NOTES[noteNum % 12];
  const octave = Math.floor(noteNum / 12) - 1;
  return note + octave;
};

const getNoteNum = (noteStr) => {
  const note = noteStr[1] === '#' ? noteStr.slice(0, 2) : noteStr.slice(0, 1);
  const octave = isNaN(noteStr.slice(-1)) ? 0 : parseInt(noteStr.slice(note.length));
  return NOTES.indexOf(note) + 12 * (octave + 1);
};

// 添加音符播放
ScratchBlocks.FieldNote.playNote_ = (noteStr /*, id*/) => {
  if (!isNaN(noteStr)) {
    noteStr = getNoteStr(noteStr);
  }
  ScratchBlocks.FieldNote.tone_.play(`${noteStr}:2`);
};

ScratchBlocks.FieldNote.prototype.classValidator = function (text) {
  if (text === null) {
    return null;
  }
  if (!isNaN(text)) {
    text = getNoteStr(text);
  }
  if (!/^[a-gA-G][#b]?(?:-1|[0-9])?$/.test(text)) {
    return null;
  }
  return text;
};

ScratchBlocks.FieldNote.prototype.setValue = function (newValue) {
  if (newValue === null) return;
  if (!isNaN(newValue)) {
    newValue = getNoteStr(newValue);
  }
  ScratchBlocks.FieldTextInput.prototype.setValue.call(this, newValue);
};

ScratchBlocks.FieldNote.prototype.setNoteNum_ = function (noteNum) {
  if (noteNum > ScratchBlocks.FieldNote.MAX_NOTE) {
    noteNum = ScratchBlocks.FieldNote.MAX_NOTE;
  }

  let noteStr = getNoteStr(noteNum);
  if (noteStr.slice(-1) === '0') {
    noteStr = noteStr.slice(0, -1);
  }
  noteStr = this.callValidator(noteStr);
  this.setValue(noteStr);

  ScratchBlocks.FieldTextInput.htmlInput_.value = noteStr;
};

ScratchBlocks.FieldNote.prototype.changeOctaveBy_ = function (octaves) {
  this.displayedOctave_ += octaves;
  if (this.displayedOctave_ < 0) {
    this.displayedOctave_ = 0;
    return;
  }
  const maxOctave = Math.floor(ScratchBlocks.FieldNote.MAX_NOTE / 12);
  if (this.displayedOctave_ > maxOctave) {
    this.displayedOctave_ = maxOctave;
    return;
  }

  const noteNum = getNoteNum(this.getText());
  const newNote = noteNum + octaves * 12;
  this.setNoteNum_(newNote);

  this.animationTarget_ = this.fieldEditorWidth_ * octaves * -1;
  this.animationPos_ = 0;
  this.stepOctaveAnimation_();
  this.setCKeyLabelsVisible_(false);
};

ScratchBlocks.FieldNote.prototype.updateSelection_ = function () {
  const noteNum = getNoteNum(this.getText());

  // If the note is outside the currently displayed octave, update it
  if (
    this.displayedOctave_ == null ||
    noteNum > this.displayedOctave_ * 12 + 12 ||
    noteNum < this.displayedOctave_ * 12
  ) {
    this.displayedOctave_ = Math.floor(noteNum / 12);
  }

  const index = this.noteNumToKeyIndex_(noteNum);

  // Clear the highlight on all keys
  this.keySVGs_.forEach(function (svg) {
    const isBlack = svg.getAttribute('data-isBlack');
    if (isBlack === 'true') {
      svg.setAttribute('fill', ScratchBlocks.FieldNote.BLACK_KEY_COLOR);
    } else {
      svg.setAttribute('fill', ScratchBlocks.FieldNote.WHITE_KEY_COLOR);
    }
  });
  // Set the highlight on the selected key
  if (this.keySVGs_[index]) {
    this.keySVGs_[index].setAttribute('fill', ScratchBlocks.FieldNote.KEY_SELECTED_COLOR);
    // Update the note name text
    const noteName = ScratchBlocks.FieldNote.KEY_INFO[index].name;
    this.noteNameText_.textContent = noteName + ' (' + Math.floor(noteNum) + ')';
    // Update the low and high C note names
    const lowCNum = this.displayedOctave_ * 12;
    this.lowCText_.textContent = 'C(' + lowCNum + ')';
    this.highCText_.textContent = 'C(' + (lowCNum + 12) + ')';
  }
};

ScratchBlocks.FieldNote.tone_ = new Tone();
