import { ColorUtils } from '@blockcode/utils';
import { ScratchBlocks } from './scratch-blocks';

const rgbToHex = (r, g, b) => ColorUtils.rgbToHex({ r, g, b });

class FieldColourSlider extends ScratchBlocks.FieldColourSlider {
  constructor(color, format = 'rgb') {
    super(color);
    this.format_ = format;
  }

  static fromJson(options) {
    return new FieldColourSlider(options.colour ?? options.color, options.format);
  }

  createColourStops_(channel) {
    if (this.format_ === 'hsv') {
      return super.createColourStops_(channel);
    }
    const stops = [];
    for (let n = 0; n <= 360; n += 20) {
      const c = Math.floor((255 * n) / 360);
      switch (channel) {
        case 'hue':
          stops.push(rgbToHex(c, this.saturation_, this.brightness_));
          break;
        case 'saturation':
          stops.push(rgbToHex(this.hue_, c, this.brightness_));
          break;
        case 'brightness':
          stops.push(rgbToHex(this.hue_, this.saturation_, c));
          break;
        default:
          throw new Error('Unknown channel for colour sliders: ' + channel);
      }
    }
    return stops;
  }

  updateDom_() {
    super.updateDom_();
    if (this.format_ === 'hsv') return;
    if (this.hueSlider_) {
      this.hueReadout_.textContent = Math.floor(this.hue_).toFixed(0);
      this.saturationReadout_.textContent = Math.floor(this.saturation_).toFixed(0);
      this.brightnessReadout_.textContent = Math.floor(this.brightness_).toFixed(0);
    }
  }

  createLabelDom_(labelText) {
    if (this.format_ === 'hsv') {
      return super.createLabelDom_(labelText);
    }
    if (labelText === ScratchBlocks.Msg.COLOUR_HUE_LABEL) {
      return super.createLabelDom_(ScratchBlocks.Msg.COLOUR_RED_LABEL);
    }
    if (labelText === ScratchBlocks.Msg.COLOUR_SATURATION_LABEL) {
      return super.createLabelDom_(ScratchBlocks.Msg.COLOUR_GREEN_LABEL);
    }
    if (labelText === ScratchBlocks.Msg.COLOUR_BRIGHTNESS_LABEL) {
      return super.createLabelDom_(ScratchBlocks.Msg.COLOUR_BLUE_LABEL);
    }
  }

  sliderCallbackFactory_(channel) {
    if (this.format_ === 'hsv') {
      return super.sliderCallbackFactory_(channel);
    }
    return (event) => {
      if (!this.sliderCallbacksEnabled_) return;
      const channelValue = event.target.getValue();
      switch (channel) {
        case 'hue':
          this.hue_ = channelValue;
          break;
        case 'saturation':
          this.saturation_ = channelValue;
          break;
        case 'brightness':
          this.brightness_ = channelValue;
          break;
      }
      let color = rgbToHex(this.hue_, this.saturation_, this.brightness_);
      if (this.sourceBlock_) {
        color = this.callValidator(color);
      }
      if (color !== null) {
        this.setValue(color);
      }
    };
  }

  activateEyedropperInternal_() {
    if (this.format_ === 'hsv') {
      return super.activateEyedropperInternal_();
    }
    ScratchBlocks.FieldColourSlider.activateEyedropper_((value) => {
      const rgb = ColorUtils.hexToRgb(value);
      this.hue_ = rgb.r;
      this.saturation_ = rgb.g;
      this.brightness_ = rgb.b;
      this.setValue(value);
    });
  }

  showEditor_() {
    super.showEditor_();
    if (this.format_ === 'hsv') return;

    this.sliderCallbacksEnabled_ = false;

    const color = this.getValue();
    const rgb = ColorUtils.hexToRgb(color);
    this.hue_ = rgb.r;
    this.saturation_ = rgb.g;
    this.brightness_ = rgb.b;

    this.hueSlider_.setUnitIncrement(1);
    this.hueSlider_.setStep(1);
    this.hueSlider_.setMinimum(0);
    this.hueSlider_.setMaximum(255);

    this.saturationSlider_.setUnitIncrement(1);
    this.saturationSlider_.setStep(1);
    this.saturationSlider_.setMinimum(0);
    this.saturationSlider_.setMaximum(255);

    this.brightnessSlider_.setUnitIncrement(1);
    this.brightnessSlider_.setStep(1);
    this.brightnessSlider_.setMinimum(0);
    this.brightnessSlider_.setMaximum(255);

    this.setValue(color);
    this.sliderCallbacksEnabled_ = true;
  }
}

ScratchBlocks.FieldColourSlider = FieldColourSlider;
ScratchBlocks.Field.register('field_colour_slider', ScratchBlocks.FieldColourSlider);
