#pragma once
#include <stdint.h>

/**
 * 四位数码管显示器
 */
class DigitDisplay {
public:
  /**
   * 设备I2C地址常量，默认为0x70
   */
  enum { kDeviceI2cAddress = 0x70 };

  /**
   * 闪烁频率枚举
   */
  enum BlinkRate : uint8_t {
    /**
     * 关闭闪烁
     */
    kBlinkOff = 0,
    /**
     * 闪烁频率2Hz
     */
    kBlinkRate2Hz = 1,
    /**
     * 闪烁频率1Hz
     */
    kBlinkRate1Hz = 2,
    /**
     * 闪烁频率0.5Hz
     */
    kBlinkRateHalfHz = 3,
  };

  /**
   * 数制枚举
   */
  enum Base : uint8_t {
    /**
     * 二进制
     */
    kBin = 2,
    /**
     * 八进制
     */
    kOct = 8,
    /**
     * 十进制
     */
    kDec = 10,
    /**
     * 十六进制
     */
    kHex = 16,
  };

  /**
   * 最大亮度常量，最大值为15
   */
  enum { kBrightnessMax = 15 };

  /**
   * 构造函数
   * device_i2c_address 设备I2C地址，默认为0x70（kDeviceI2cAddress）
   */
  DigitDisplay(const uint8_t device_i2c_address = kDeviceI2cAddress);

  /**
   * 初始化设置
   */
  void Setup();

  /**
   * 清空显示内容
   */
  void Clear();

  /**
   * 设置闪烁频率
   * blink_rate 闪烁频率枚举
   */
  void SetBlinkRate(const BlinkRate blink_rate);

  /**
   * 设置亮度
   * brightness 亮度值，范围为0-15
   */
  void SetBrightness(uint8_t brightness);

  /**
   * 显示/隐藏冒号
   * state 显示/隐藏
   */
  void ShowColon(const bool state);

  /**
   * 在指定的数码管上显示数字
   * index 数码管索引，范围为0-3
   * num 数字值
   * dot 是否显示小数点，默认为false
   */
  void ShowDigitNumber(uint8_t index, const uint8_t num,
                       const bool dot = false);

  /**
   * 显示数值
   * num 数字值，整型，范围为 -999 ~ 9999，超出范围将无法正常显示，会显示为
   * "----"
   * base 数制枚举，默认为10(DigitDisplay::kDec)
   */
  template <typename T> void ShowNumber(T num, const Base base = kDec) {
    ShowNumber(static_cast<double>(num), base, 0);
  }

  /**
   * 显示数值
   * num 数字值，float类型，范围为 -999 ~ 9999，超出范围将无法正常显示，会显示为
   * "----"
   * fractional_part_digits 小数点后位数，默认为-1（自动获取）
   */
  void ShowNumber(float number, int fractional_part_digits) {
    ShowNumber(static_cast<double>(number), fractional_part_digits);
  }

  /**
   * 显示数值
   * num 数字值，double类型，范围为 -999 ~
   * 9999，超出范围将无法正常显示，会显示为 "----"
   * fractional_part_digits 小数点后位数，默认为-1
   */
  void ShowNumber(double number, int fractional_part_digits) {
    ShowNumber(number, kDec, fractional_part_digits);
  }

  /**
   * 显示数值
   * number 数字值，float类型，范围为 -999 ~
   * 9999，超出范围将无法正常显示，会显示为 "----"
   * base 数制枚举，默认为10(DigitDisplay::kDec)
   * fractional_part_digits 小数点后位数，默认为-1
   */
  void ShowNumber(float number, const Base base = kDec,
                  int fractional_part_digits = -1) {
    ShowNumber(static_cast<double>(number), base, fractional_part_digits);
  }

  /**
   * 显示数值
   * number 数字值，double类型，范围为 -999 ~
   * 9999，超出范围将无法正常显示，会显示为 "----"
   * base 数制枚举，默认为10(DigitDisplay::kDec)
   * fractional_part_digits 小数点后位数，默认为-1
   */
  void ShowNumber(double number, const Base base = kDec,
                  int fractional_part_digits = -1);

private:
  /**
   * 显示错误，数码管将会显示 "----"
   */
  void ShowError();

  /**
   * 更新显示内容
   */
  void Display();

  uint8_t device_i2c_address_;
  uint16_t display_buffer_[5] = {0};
};
