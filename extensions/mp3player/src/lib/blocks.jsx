import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.mp3player.init"
        defaultMessage="set pins TX:[TX] RX:[RX]"
      />
    ),
    inputs: {
      TX: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      RX: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    ino(block) {
      const tx = meta.boardPins ? block.getFieldValue('TX') : this.valueToCode(block, 'TX', this.ORDER_ATOMIC);
      const rx = meta.boardPins ? block.getFieldValue('RX') : this.valueToCode(block, 'RX', this.ORDER_ATOMIC);
      this.definitions_['variable_mp3player'] = `GD5800_Serial mp3player(${tx}, ${rx});`;
      this.definitions_['setup_mp3player'] = `mp3player.begin(9600);`;
      this.definitions_['setup_mp3player_pause'] = `mp3player.pause();`;
      return '';
    },
  },
  '---',
  {
    id: 'play',
    text: (
      <Text
        id="blocks.mp3player.play"
        defaultMessage="play"
      />
    ),
    ino(block) {
      const code = 'mp3player.play();\n';
      return code;
    },
  },
  {
    id: 'playTrack',
    text: (
      <Text
        id="blocks.mp3player.playTrack"
        defaultMessage="play song [TRACK]"
      />
    ),
    inputs: {
      TRACK: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino(block) {
      const track = this.valueToCode(block, 'TRACK', this.ORDER_ATOMIC);
      const code = `mp3player.playFileByIndexNumber(${track});\n`;
      return code;
    },
  },
  {
    id: 'pause',
    text: (
      <Text
        id="blocks.mp3player.pause"
        defaultMessage="pause"
      />
    ),
    ino(block) {
      const code = 'mp3player.pause();\n';
      return code;
    },
  },
  {
    id: 'next',
    text: (
      <Text
        id="blocks.mp3player.next"
        defaultMessage="next"
      />
    ),
    ino(block) {
      const code = 'mp3player.next();\n';
      return code;
    },
  },
  {
    id: 'prev',
    text: (
      <Text
        id="blocks.mp3player.prev"
        defaultMessage="previous"
      />
    ),
    ino(block) {
      const code = 'mp3player.prev();\n';
      return code;
    },
  },
  // {
  //   id: 'stop',
  //   text: (
  //     <Text
  //       id="blocks.mp3player.stop"
  //       defaultMessage="stop"
  //     />
  //   ),
  //   ino(block) {
  //     const code = 'mp3player.stop();\n';
  //     return code;
  //   },
  // },
  '---',
  {
    id: 'volume',
    text: (
      <Text
        id="blocks.mp3player.volume"
        defaultMessage="set volume to [VOL]"
      />
    ),
    inputs: {
      VOL: {
        shadow: 'volumeValue',
        defaultValue: 50,
      },
    },
    ino(block) {
      const vol = this.valueToCode(block, 'VOL', this.ORDER_NONE);
      const code = `mp3player.setVolume(${vol});\n`;
      return code;
    },
  },
  {
    id: 'volumeValue',
    shadow: true,
    output: 'number',
    inputs: {
      VOL: {
        type: 'slider',
        defaultValue: 25,
        min: 0,
        max: 30,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('VOL') || 0;
      return [code];
    },
    ino(block) {
      const code = block.getFieldValue('VOL') || 0;
      return [code];
    },
  },
  {
    id: 'volumeUp',
    text: (
      <Text
        id="blocks.mp3player.volumeUp"
        defaultMessage="volume up"
      />
    ),
    ino(block) {
      const code = 'mp3player.volumeUp();\n';
      return code;
    },
  },
  {
    id: 'volumeDown',
    text: (
      <Text
        id="blocks.mp3player.volumeDown"
        defaultMessage="volume down"
      />
    ),
    ino(block) {
      const code = 'mp3player.volumeDn();\n';
      return code;
    },
  },
  '---',
  {
    id: 'eq',
    text: (
      <Text
        id="blocks.mp3player.eq"
        defaultMessage="set equalizer to [EQ]"
      />
    ),
    inputs: {
      EQ: {
        menu: [
          [
            <Text
              id="blocks.mp3player.eqNormal"
              defaultMessage="normal"
            />,
            '0',
          ],
          [
            <Text
              id="blocks.mp3player.eqPop"
              defaultMessage="pop"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.mp3player.eqRock"
              defaultMessage="rock"
            />,
            '2',
          ],
          [
            <Text
              id="blocks.mp3player.eqJazz"
              defaultMessage="jazz"
            />,
            '3',
          ],
          [
            <Text
              id="blocks.mp3player.eqClassic"
              defaultMessage="classic"
            />,
            '4',
          ],
          [
            <Text
              id="blocks.mp3player.eqBass"
              defaultMessage="bass"
            />,
            '5',
          ],
        ],
      },
    },
    ino(block) {
      const eq = block.getFieldValue('EQ');
      const code = `mp3player.setEqualizer(${eq});\n`;
      return code;
    },
  },
  {
    id: 'mode',
    text: (
      <Text
        id="blocks.mp3player.mode"
        defaultMessage="set play mode to [MODE]"
      />
    ),
    inputs: {
      MODE: {
        menu: [
          [
            <Text
              id="blocks.mp3player.modeLoop"
              defaultMessage="loop"
            />,
            '0',
          ],
          [
            <Text
              id="blocks.mp3player.modeSingleLoop"
              defaultMessage="single loop"
            />,
            '2',
          ],
          [
            <Text
              id="blocks.mp3player.modeShuffle"
              defaultMessage="shuffle"
            />,
            '3',
          ],
        ],
      },
    },
    ino(block) {
      const mode = block.getFieldValue('MODE');
      const code = `mp3player.setLoopMode(${mode});\n`;
      return code;
    },
  },
];
