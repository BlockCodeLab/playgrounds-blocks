import { ScratchBlocks } from './scratch-blocks';

class FieldHexNumber extends ScratchBlocks.FieldTextInput {
  constructor(opt_text, opt_length, opt_validator) {
    super(opt_text, opt_validator, /[0-9A-Fa-f]/);
    this.addArgType('hex');
    this.lenght_ = opt_length;
  }

  static fromJson(options) {
    return new FieldHexNumber(options.text, options.length);
  }

  setText(newText) {
    if (newText == null) return;
    newText = newText.replace(/^0x/, '') ?? '';
    if (this.lenght_ && newText.length > this.lenght_) {
      newText = newText.slice(0, this.lenght_);
    }
    super.setText(`0x${newText.toUpperCase() || 0}`);
  }

  showEditor_(opt_quietInput, opt_readOnly, opt_withArrow, opt_arrowCallback) {
    super.showEditor_(opt_quietInput, opt_readOnly, opt_withArrow, opt_arrowCallback);
    if (this.lenght_) {
      FieldHexNumber.htmlInput_.setAttribute('maxlength', this.lenght_ + 2);
    }
  }

  onHtmlInputChange_(e) {
    super.onHtmlInputChange_(e);
    let value = FieldHexNumber.htmlInput_.value ?? '';
    value = value.replace(/^0x/, '');
    if (this.lenght_ && value.length > this.lenght_) {
      value = value.slice(0, this.lenght_);
    }
    FieldHexNumber.htmlInput_.value = `0x${value?.toUpperCase() || 0}`;
  }
}

ScratchBlocks.FieldHexNumber = FieldHexNumber;
ScratchBlocks.Field.register('field_hex_number', ScratchBlocks.FieldHexNumber);
