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
    gen.definitions_['loop_rfidrc522_whennewcard'] = 'rfidrc522_whennewcard();';
    gen.definitions_['rfidrc522_whennewcard'] = code;
  }
};

export const blocks = (meta) => [
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
      DefaultInitRFID(this);

      let funcCode = '';
      funcCode += 'String getRFIDCardId(bool checked) {\n';
      funcCode += '  String rfid_str = "";\n';
      funcCode += '  if (checked && mfrc522.uid.size > 0) {\n';
      funcCode += '    rfid_str += "0x";\n';
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
  },
];
