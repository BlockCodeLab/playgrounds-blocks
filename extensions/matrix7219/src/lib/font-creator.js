import fontUrl from './quan.ttf';

const fontname = 'quan';
const fontWidth = 8;
const fontface = new FontFace(fontname, `url(${fontUrl})`);
document.fonts.add(fontface);
fontface.load();

// const canvas = document.createElement('canvas');
// const ctx = canvas.getContext('2d', { willReadFrequently: true });
// fontface.loaded
//   .then(() => {
//     ctx.font = `${fontWidth}px ${fontname}`;
//     ctx.textAlign = 'left';
//     ctx.textBaseline = 'top';
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const convert = (char) => {
  // 不是中文不进行转换
  // if (/[^\u4E00-\u9FA5]/.test(char)) {
  //     return;
  // }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.font = `${fontWidth}px ${fontname}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 10, 10);
  ctx.fillStyle = '#000000';
  ctx.fillText(char, 0, 0);
  const { data } = ctx.getImageData(0, 0, fontWidth, fontWidth);

  // 获取字模
  let bytes = [];
  let row = [];
  for (let i = 0; i < data.length; i += 4) {
    row.push(data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0 ? 1 : 0);
    if (row.length === fontWidth) {
      bytes.push(row);
      row = [];
    }
  }

  // 字模行列转换，以列储存数据，方便列滚动显示
  let hex = [];
  for (let i = 0; i < fontWidth; i++) {
    row = [];
    for (let j = 0; j < fontWidth; j++) {
      row.push(bytes[j][i]);
    }
    hex.push(`00${parseInt(row.join(''), 2).toString(16)}`.slice(-2));
  }

  // 清理字模前后空白
  let len = hex.length;
  for (let i = 0; i < len; i++) {
    if (hex[0] !== '00') {
      break;
    }
    hex.shift();
  }
  len = hex.length;
  for (let i = 0; i < len; i++) {
    if (hex.at(-1) !== '00') {
      break;
    }
    hex.pop();
  }

  if (hex.length === 0) {
    return;
  }
  return hex;
};

export const createFontWithCStyle = (all) => {
  const fontMap = new Map();
  const map = [];
  let maxWidth = 0;
  let result = '';

  all = all.trim();
  for (let char of all) {
    if (char === ' ') continue;
    const value = convert(char);
    if (value) {
      if (value.length > maxWidth) {
        maxWidth = value.length;
      }
      fontMap.set(char, value);
    }
  }

  // 空格
  const width = `00${Math.ceil(maxWidth / 2).toString(16)}`.slice(-2);
  result += `  {${'0x00,'.repeat(maxWidth)}0x${width}}, // 空格\n`;
  map.push(' ');

  Array.from(fontMap.entries())
    // .sort((char1, char2) => {
    //   return char1[0].charCodeAt(0) - char2[0].charCodeAt(0);
    // })
    .forEach(([char, value]) => {
      const block = '0x00,'.repeat(maxWidth - value.length);
      const width = `00${value.length.toString(16)}`.slice(-2);
      const desc = `// ${char === '\\' ? 'backslash' : char}`;
      result += `  {0x${value.join(',0x')},${block}0x${width}}, ${desc}\n`;
      map.push(char);
    });

  let content = '';
  content += `static byte FONTS[${fontMap.size + 1}][${maxWidth + 1}] = {\n${result}};\n`;
  content += `static char *FONT_MAP[] = {"${map.map((c) => (c === '"' ? '\\"' : c === '\\' ? '\\\\' : c)).join('","')}"};\n`;
  content += `static int FONT_COUNT = ${fontMap.size + 1};\n`;
  content += `static int FONT_WIDTH_INDEX = ${maxWidth};\n`;
  return { content, map };
};

export const createFontWithPythonStyle = (all) => {
  const fontMap = new Map();
  const map = [];
  let maxWidth = 0;
  let result = '';

  all = all.trim();
  for (let char of all) {
    if (char === ' ') continue;
    const value = convert(char);
    if (value) {
      if (value.length > maxWidth) {
        maxWidth = value.length;
      }
      fontMap.set(char, value);
    }
  }

  // 空格
  const width = `00${Math.ceil(maxWidth / 2).toString(16)}`.slice(-2);
  result += `  b"${'\\x00'.repeat(maxWidth)}\\x${width}", # 空格\n`;
  map.push(' ');

  Array.from(fontMap.entries())
    // .sort((char1, char2) => {
    //   return char1[0].charCodeAt(0) - char2[0].charCodeAt(0);
    // })
    .forEach(([char, value]) => {
      const block = '\\x00'.repeat(maxWidth - value.length);
      const width = `00${value.length.toString(16)}`.slice(-2);
      result += `  b"\\x${value.join('\\x')}${block}\\x${width}", # ${char}\n`;
      map.push(char);
    });

  let content = `USER_FONTS = (\n${result})\n`;
  content += `USER_FONT_WIDTH_INDEX = ${maxWidth}\n`;
  content += `USER_FONT_MAP = "${map.join('').replace('"', '\\"')}"\n`;
  return { content, map };
};
