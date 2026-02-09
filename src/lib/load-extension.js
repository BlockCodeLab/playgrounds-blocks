import { xmlEscape, Konva } from '@blockcode/utils';
import { themeColors, maybeTranslate, translate } from '@blockcode/core';
import { Runtime } from './runtime/runtime';
import { ScratchBlocks } from '../lib/scratch-blocks';
import { blockSeparator, categorySeparator } from '../lib/make-toolbox-xml';

const THEME_COLOR = themeColors.blocks.primary;
const INPUT_COLOR = themeColors.blocks.secondary;
const OTHER_COLOR = themeColors.blocks.tertiary;

const ShadowTypes = {
  broadcast: 'event_broadcast_menu',
  number: 'math_number',
  integer: 'math_integer',
  positive_number: 'math_positive_number',
  positive_integer: 'math_whole_number',
  angle: 'math_angle',
  hex: 'math_hex',
  hex8: 'math_hex8',
  hex16: 'math_hex16',
  hex32: 'math_hex32',
  hex64: 'math_hex64',
  text: 'text',
  string: 'text',
  color: 'colour_picker',
  matrix: 'matrix',
  note: 'note',
};

const FieldNames = {
  broadcast: 'BROADCAST_INPUT',
  number: 'NUM',
  integer: 'NUM',
  positive_number: 'NUM',
  positive_integer: 'NUM',
  angle: 'NUM',
  hex: 'HEX',
  hex8: 'HEX',
  hex16: 'HEX',
  hex32: 'HEX',
  hex64: 'HEX',
  text: 'TEXT',
  string: 'TEXT',
  matrix: 'MATRIX',
  note: 'NOTE',
};

export function loadExtension(extObj, options, meta) {
  const extId = extObj.id;
  const extName = maybeTranslate(extObj.name);
  const { generator, emulator } = options;

  // 扩展模拟器
  if (emulator && extObj.emulator && Runtime.currentRuntime) {
    if (!Runtime.currentRuntime._extensions.has(extId)) {
      const runtime = new Proxy(Runtime.currentRuntime, {
        get(target, prop, receiver) {
          if (prop === 'on') {
            return (eventName, listener) => {
              // 扩展硬件连接
              if (eventName === 'connecting') {
                eventName = `${extId}.connecting`;
              }
              target.on(eventName, listener);
            };
          }
          if (prop === 'emit') {
            return (eventName, ...args) => {
              // 扩展硬件断开连接
              if (eventName === 'disconnect') {
                eventName = `${extId}.disconnect`;
              }
              target.emit(eventName, ...args);
            };
          }
          return Reflect.get(target, prop, target);
        },
      });
      const extEmu = extObj.emulator(runtime, Konva);
      Runtime.currentRuntime._extensions.set(extId, extEmu);
      Runtime.currentRuntime._extensions.set(extEmu.key, extEmu);
    }
  }

  let categoryXML = `<category id="${xmlEscape(extId)}" name="${xmlEscape(extName)}"`;
  categoryXML += ` colour="${xmlEscape(extObj.themeColor || THEME_COLOR)}"`;
  categoryXML += ` secondaryColour="${xmlEscape(extObj.inputColor || INPUT_COLOR)}"`;
  if (extObj.statusButton) {
    categoryXML += ` showStatusButton="true"`;
  }
  if (extObj.icon) {
    categoryXML += ` iconURI="${xmlEscape(extObj.icon)}"`;
  }
  categoryXML += `>`;

  extObj.menus = extObj.menus || {};

  // 说明文档
  if (extObj.readme) {
    categoryXML +=
      `<button text="${translate('blocks.extensions.documentation', 'Open Documentation')}" ` +
      `web-class="readme-${xmlEscape(extObj.readme)}" ` +
      'callbackKey="OPEN_DOCUMENTATION"/>';
  }

  const blocks = typeof extObj.blocks === 'function' ? extObj.blocks(meta) : extObj.blocks;

  categoryXML += blocks
    .filter((block, index) => {
      // 不显示排在最后的空白分割线
      if (block === '---') {
        return index < blocks.length - 1;
      }
      // block.hidden 不用于过滤，只用于是否需要显示在积木栏
      return true;
    })
    .reduce((blocksXML, block) => {
      // 空白分割线
      if (block === '---') {
        if (!blocksXML.length) return blocksXML;
        return blocksXML + blockSeparator;
      }

      if (!block.hidden) {
        // 文本标签
        if (block.label) {
          return blocksXML + `<label text="${maybeTranslate(block.label)}"/>`;
        }
        // 按钮
        if (block.button) {
          const buttonKey = `${extId}_${block.button}`;
          const workspace = ScratchBlocks.getMainWorkspace();
          if (workspace) {
            const toolboxWorkspace = workspace.getFlyout()?.getWorkspace();
            if (toolboxWorkspace && block.onClick) {
              toolboxWorkspace.registerButtonCallback(buttonKey, async (arg) => {
                // 如果返回 true 值，则刷新工作区
                if ((await block.onClick(arg)) === true) {
                  options.updateWorkspace();
                }
              });
            }
          }
          return blocksXML + `<button text="${maybeTranslate(block.text)}" callbackKey="${buttonKey}"/>`;
        }
      }

      // 构建积木
      // xml用于在工具栏显示
      // json用于代码转换，有可能不显示的积木也存在代码转换
      const blockId = `${extId}_${block.id}`;
      let blockXML = '';

      // 显示特殊定义的积木
      if (block.custom) {
        blockXML = `<block type="${xmlEscape(blockId)}">`;
        if (typeof custom === 'string') {
          blockXML += custom;
        }
        blockXML += '</block>';
      }

      // 创建新的积木（内部连接或可显示）
      else if (block.shadow || block.text) {
        blockXML = `<block type="${xmlEscape(blockId)}">`;

        const blockJson = {
          message0: block.text ? maybeTranslate(block.text) : '%1',
          category: extId,
          outputShape: ScratchBlocks.OUTPUT_SHAPE_SQUARE,
          colour: extObj.themeColor || THEME_COLOR,
          colourSecondary: extObj.inputColor || INPUT_COLOR,
          colourTertiary: extObj.otherColor || OTHER_COLOR,
        };

        let argsIndexStart = 1;
        const blockIcon = block.icon ?? extObj.blockIcon ?? extObj.icon;
        if (!block.shadow && blockIcon) {
          blockJson.message0 = `%1 %2 ${blockJson.message0}`;
          blockJson.args0 = [
            {
              type: 'field_image',
              src: blockIcon,
              width: 40,
              height: 40,
            },
            {
              type: 'field_vertical_separator',
            },
          ];
          blockJson.extensions = ['scratch_extension'];
          argsIndexStart += 2;
        }

        // 积木外观
        //
        if (block.hat) {
          blockJson.nextStatement = null;
        } else if (block.end) {
          blockJson.previousStatement = null;
        } else if (block.output) {
          if (block.output === 'boolean') {
            blockJson.output = 'Boolean';
            blockJson.outputShape = ScratchBlocks.OUTPUT_SHAPE_HEXAGONAL;
          } else {
            blockJson.output = block.output === 'number' ? 'Number' : 'String';
            blockJson.outputShape = ScratchBlocks.OUTPUT_SHAPE_ROUND;
          }
          blockJson.checkboxInFlyout = block.monitoring === true;
        } else {
          blockJson.previousStatement = null;
          blockJson.nextStatement = null;
        }
        if (block.substack) {
          blockJson.message1 = '%1';
          blockJson.args1 = [
            {
              type: 'input_statement',
              name: 'SUBSTACK',
            },
          ];
        } else if (block.repeat) {
          blockJson.message1 = '%1'; // Statement
          blockJson.message2 = '%1'; // Icon
          blockJson.lastDummyAlign2 = 'RIGHT';
          blockJson.args1 = [
            {
              type: 'input_statement',
              name: 'SUBSTACK',
            },
          ];
          blockJson.args2 = [
            {
              type: 'field_image',
              src: 'M21.8,11h-2.6c0,1.5-0.3,2.9-1,4.2c-0.8,1.6-2.1,2.8-3.7,3.6c-1.5,0.8-3.3,1.1-4.9,0.8c-1.6-0.2-3.2-1-4.4-2.1 c-0.4-0.3-0.4-0.9-0.1-1.2c0.3-0.4,0.9-0.4,1.2-0.1l0,0c1,0.7,2.2,1.1,3.4,1.1s2.3-0.3,3.3-1c0.9-0.6,1.6-1.5,2-2.6 c0.3-0.9,0.4-1.8,0.2-2.8h-2.4c-0.4,0-0.7-0.3-0.7-0.7c0-0.2,0.1-0.3,0.2-0.4l4.4-4.4c0.3-0.3,0.7-0.3,0.9,0L22,9.8 c0.3,0.3,0.4,0.6,0.3,0.9S22,11,21.8,11z',
              width: 24,
              height: 24,
              alt: '*',
              flip_rtl: true,
            },
          ];
        }

        // 积木参数项
        if (block.inputs) {
          blockJson.checkboxInFlyout = false;
          blockJson.args0 = [].concat(
            blockJson.args0 || [],
            Object.entries(block.inputs).map(([name, arg]) => {
              const argObject = { name };
              switch (arg.type) {
                case 'image':
                  argObject.type = 'field_image';
                  argObject.src = arg.src;
                  argObject.width = 24;
                  argObject.height = 24;
                  break;

                case 'variable':
                  argObject.type = 'field_variable';
                  argObject.variableTypes = arg.variables;
                  argObject.variable = arg.defaultValue;
                  break;

                case 'slider':
                  argObject.type = 'field_slider';
                  argObject.value = arg.defaultValue ?? 0;
                  argObject.min = arg.min ?? 0;
                  argObject.max = arg.max ?? 100;
                  argObject.precision = arg.step ?? 1;
                  blockJson.colour = ScratchBlocks.Colours.textField;
                  blockJson.colourSecondary = ScratchBlocks.Colours.textField;
                  blockJson.colourTertiary = ScratchBlocks.Colours.textField;
                  blockJson.colourQuaternary = ScratchBlocks.Colours.textField;
                  break;

                default:
                  if (block.shadow) {
                    // 自定义原生内联积木
                    // 添加修改参数
                    if (arg.type === 'matrix') {
                      argObject.type = 'field_matrix';
                      argObject.width = arg.width ?? 5;
                      argObject.height = arg.height ?? 5;
                      break;
                    } else if (arg.type === 'color') {
                      argObject.type = 'field_colour_slider';
                      argObject.format = arg.format ?? 'rgb';
                      argObject.color = arg.defaultValue;
                      break;
                    }
                  }

                  argObject.type = 'input_value';

                  if (arg.type === 'boolean') {
                    argObject.check = 'Boolean';
                  } else if (arg.menu) {
                    let menu = arg.menu;
                    let menuName = arg.name || name;
                    let inputMode = arg.inputMode || false;
                    let inputType = arg.type || 'string';
                    let inputDefault = arg.defaultValue || '';
                    if (typeof menu === 'string') {
                      menuName = arg.menu;
                      menu = extObj.menus[menuName];
                    }
                    if (!Array.isArray(menu)) {
                      inputMode = menu.inputMode || inputMode;
                      inputType = menu.type || inputType;
                      inputDefault = menu.defaultValue || inputDefault;
                      menu = menu.items;
                    }
                    if (inputMode) {
                      if (!extObj.menus[menuName]) {
                        extObj.menus[menuName] = {
                          inputMode,
                          type: inputType,
                          defaultValue: inputDefault,
                          items: menu,
                        };
                      }
                      blockXML += `<value name="${xmlEscape(name)}">`;
                      blockXML += `<shadow type="${extId}_menu_${menuName}">`;
                      if (inputDefault != null) {
                        blockXML += `<field name="${menuName}">${xmlEscape(maybeTranslate(inputDefault))}</field>`;
                      }
                      blockXML += '</shadow></value>';
                    } else if (menu) {
                      argObject.type = 'field_dropdown';
                      argObject.options = menu.map((item) => {
                        if (Array.isArray(item)) {
                          const [text, value] = item;
                          return [maybeTranslate(text), value];
                        }
                        item = `${item}`;
                        return [item, item];
                      });
                      if (arg.defaultValue != null) {
                        blockXML += `<field name="${xmlEscape(name)}">${xmlEscape(
                          maybeTranslate(arg.defaultValue),
                        )}</field>`;
                      }
                    }
                  } else {
                    blockXML += `<value name="${xmlEscape(name)}">`;
                    const shadowType = arg.shadowType ?? ShadowTypes[arg.type] ?? `${extId}_${arg.shadow}`;
                    if (shadowType) {
                      blockXML += `<shadow ${arg.id ? `id="${arg.id}" ` : ''}type="${shadowType}">`;
                      const fieldName = arg.fieldName ?? FieldNames[arg.type] ?? xmlEscape(name);
                      if (arg.defaultValue != null && fieldName) {
                        blockXML += `<field name="${fieldName}">${xmlEscape(maybeTranslate(arg.defaultValue))}</field>`;
                      }
                      blockXML += '</shadow>';
                    }
                    blockXML += '</value>';
                  }
              }

              blockJson.message0 = blockJson.message0
                ? blockJson.message0.replace(`[${name}]`, `%${argsIndexStart++}`)
                : '';
              return argObject;
            }),
          );
        }

        // 如果积木已存在且没有备份则先进行备份
        if (ScratchBlocks.Blocks[blockId] && !ScratchBlocks.Blocks[`#${blockId}`]) {
          ScratchBlocks.Blocks[`#${blockId}`] = ScratchBlocks.Blocks[blockId];
        }
        // 加入扩展的积木
        ScratchBlocks.Blocks[blockId] = {
          init() {
            this.jsonInit(blockJson);
            block.onInit?.call(this);
          },
          onchange(e) {
            block.onChange?.call(this, e);
          },
        };

        blockXML += '</block>';
        if (block.shadow) {
          blockXML = '';
        }
      }

      // 扩展积木代码生成器
      if (generator) {
        let codeName = generator.name_.toLowerCase();
        if (block[codeName]) {
          generator[blockId] = block[codeName].bind(generator);
        } else if (!generator[blockId]) {
          generator[blockId] = () => '';
        }
      }
      if (emulator) {
        let codeName = emulator.name_.toLowerCase();
        if (block[codeName]) {
          emulator[blockId] = block[codeName].bind(emulator);
        } else if (!emulator[blockId]) {
          emulator[blockId] = () => '';
        }
      }

      // 将需要显示的积木添加到工具栏
      if (!block.hidden) {
        blocksXML += blockXML;
      }
      return blocksXML;
    }, '');

  if (extObj.skipXML) {
    return false;
  }

  // 选项菜单输入
  Object.entries(extObj.menus).forEach(([menuName, menu]) => {
    if (!menu.inputMode) return;

    const menuBlockId = `${extId}_menu_${menuName}`;
    const outputType = menu.type === 'number' ? 'output_number' : 'output_string';

    // 动态获取菜单项
    if (typeof menu.getItems === 'function') {
      menu.items = menu.getItems();
    }

    if (!menu.items) {
      menu.items = [''];
    }
    const blockJson = {
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: menuName,
          options: menu.items.map((item) => {
            if (Array.isArray(item)) {
              const [text, value] = item;
              return [xmlEscape(maybeTranslate(text)), value];
            }
            item = `${item}`;
            return [item, item];
          }),
        },
      ],
      category: extId,
      colour: extObj.themeColor || THEME_COLOR,
      colourSecondary: extObj.inputColor || INPUT_COLOR,
      colourTertiary: extObj.otherColor || OTHER_COLOR,
      extensions: [outputType],
    };

    // 自动生成菜单积木
    ScratchBlocks.Blocks[menuBlockId] = {
      init() {
        this.jsonInit(blockJson);
      },
    };

    // 自动转换菜单积木代码
    if (generator) {
      generator[menuBlockId] = (block) => {
        let value = block.getFieldValue(menuName) || menu.defaultValue;
        if (menu.type === 'integer') {
          value = parseInt(value);
        } else if (menu.type === 'number') {
          value = Number(value);
        } else {
          value = generator.quote_(value);
        }
        return [value, generator.ORDER_ATOMIC];
      };
    }
    if (emulator) {
      emulator[menuBlockId] = (block) => {
        let value = block.getFieldValue(menuName) || menu.defaultValue;
        if (menu.type === 'integer') {
          value = parseInt(value);
        } else if (menu.type === 'number') {
          value = Number(value);
        } else {
          value = generator.quote_(value);
        }
        return [value, emulator.ORDER_ATOMIC];
      };
    }
  });

  categoryXML += `${categorySeparator}</category>`;
  return categoryXML;
}
