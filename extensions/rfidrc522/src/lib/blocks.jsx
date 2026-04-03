import { Text } from '@blockcode/core';

const DefaultInitRFID = (gen, block) => {
  gen.definitions_['include_rfidrc522'] = '#include <MFRC522v2.h>';
  gen.definitions_['include_rfidrc522_i2c'] = '#include <MFRC522DriverI2C.h>';
  if (!gen.definitions_['variable_rfidrc522_driver']) {
    gen.definitions_['variable_rfidrc522_driver'] = 'MFRC522DriverI2C mfrc522Driver{};';
  }
  gen.definitions_['variable_rfidrc522'] = 'MFRC522 mfrc522{mfrc522Driver};';
  gen.definitions_['setup_mfrc522'] = 'mfrc522.PCD_Init();';

  let code = '';
  code += 'bool rfidrc522_check() {\n';
  code += '  return mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial();\n';
  code += '}\n';
  gen.definitions_['declare_rfidrc522_check'] = 'bool rfidrc522_check();';
  gen.definitions_['rfidrc522_check'] = code;

  if (block) {
    const branchCode = block ? gen.statementToCode(block) : '';
    let code = '';
    code += 'void rfidrc522_whennewcard() {\n';
    code += '  if (!rfidrc522_check()) return;\n';
    code += branchCode || '';
    code += '  mfrc522.PICC_HaltA();\n';
    code += '}\n';
    gen.definitions_['declare_rfidrc522_whennewcard'] = 'void rfidrc522_whennewcard();';
    gen.definitions_['rfidrc522_whennewcard'] = code;
  }
};

export const blocks = (meta) => [
  meta.editor === '@blockcode/gui-arduino'
    ? {
        id: 'eventPolling',
        text: (
          <Text
            id="blocks.rfidrc522.eventPolling"
            defaultMessage="RFID events polling"
          />
        ),
        ino(block) {
          DefaultInitRFID(this);
          const code = 'rfidrc522_whennewcard();\n';
          return code;
        },
      }
    : {
        id: 'init',
        text: (
          <Text
            id="blocks.rfidrc522.initI2C"
            defaultMessage="set pins SCL:[SCL] SDA:[SDA]"
          />
        ),
        inputs: {
          SCL: meta.boardPins
            ? { menu: meta.boardPins.out }
            : {
                type: 'positive_integer',
                defaultValue: 2,
              },
          SDA: meta.boardPins
            ? { menu: meta.boardPins.out }
            : {
                type: 'positive_integer',
                defaultValue: 3,
              },
        },
        mpy(block) {
          const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
          const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);
          this.definitions_['rfid'] = `rfid = mfrc522.MFRC522(${scl}, ${sda})`;
          return '';
        },
      },
  '---',
  {
    id: 'whennewcard',
    text: (
      <Text
        id="blocks.rfidrc522.whennewcard"
        defaultMessage="when a new card"
      />
    ),
    hat: true,
    ino(block) {
      DefaultInitRFID(this, block);
      return '';
    },
    mpy(block) {
      this.definitions_['rfid_uid'] = 'rfid_uid = ""';
      if (!this.definitions_['rfidrc522_whennewcard']) {
        let code = '';
        code += '@_tasks__.append\n';
        code += 'async def rfidrc522_whennewcard():\n';
        code += '  global rfid_uid\n';
        code += '  while True:\n';
        code += '    await asyncio.sleep_ms(5)\n';
        code += '    status, data, bits = rfid.scan()\n';
        code += '    if status != rfid.MIFARE_OK: continue\n';
        code += '    status, uid, bits = rfid.identify()\n';
        code += '    if status != rfid.MIFARE_OK: continue\n';
        code += '    rfid_uid = "".join(f"{b:02x}" for b in uid[0:4])\n';
        this.definitions_['rfidrc522_whennewcard'] = code;
      }

      const flagName = this.createName('rfidrc522_flag');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      // const funcName = this.createName('rfidrc522_callback');
      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, 'rfidrc522_callback');
      code = '@_tasks__.append\n';
      code += branchCode;
      this.definitions_[`${flagName}_callback`] = code;

      code = `    ${flagName}.set()\n`;
      this.definitions_['rfidrc522_whennewcard'] += code;
    },
  },
  {
    id: 'cardid',
    text: (
      <Text
        id="blocks.rfidrc522.cardid"
        defaultMessage="card id"
      />
    ),
    output: 'string',
    ino(block) {
      let funcCode = '';
      funcCode += 'String getRFIDCardId(bool checked) {\n';
      funcCode += '  String rfid_str = "";\n';
      funcCode += '  if (checked && mfrc522.uid.size > 0) {\n';
      // funcCode += '    rfid_str += "0x";\n';
      funcCode += '    for (byte i = 0; i < mfrc522.uid.size; i++)\n';
      funcCode += '      rfid_str += String(mfrc522.uid.uidByte[i], HEX);\n';
      funcCode += '  }\n';
      funcCode += '  return rfid_str;\n';
      funcCode += '}\n';
      this.definitions_['declare_getRFIDCardId'] = 'String getRFIDCardId(bool checked);';
      this.definitions_['getRFIDCardId'] = funcCode;

      const rootBlock = block.getRootBlock();
      const checked = rootBlock.type.endsWith('_whennewcard') ? true : 'rfidrc522_check()';
      const code = `getRFIDCardId(${checked})`;
      return [code];
    },
    mpy(block) {
      this.definitions_['rfid_uid'] = 'rfid_uid = ""';
      return ['rfid_uid'];
    },
  },
];
