import { Text } from '@blockcode/core';

const ProcessSubscribeCode = `void processSubscribe() {
  auto& mqtt = espAtManager.Mqtt();
  mqtt.GetStream().setTimeout(100);
  auto data = mqtt.Receive();
  if (data.length == 0) return;
  String content = "";
  uint16_t remaining = data.length;
  while (remaining > 0) {
    if (mqtt.GetStream().available() > 0) {
      content += char(mqtt.GetStream().read());
      remaining--;
    }
  };
}`;

export const blocks = (meta) => [
  {
    id: 'wifi',
    text: (
      <Text
        id="blocks.c2mqtt.wifi"
        defaultMessage="connect to wifi ssid:[SSID] password:[PWD]"
      />
    ),
    inputs: {
      SSID: {
        type: 'string',
        defaultValue: 'wifi',
      },
      PWD: {
        type: 'string',
        defaultValue: 'pass',
      },
    },
    ino(block) {
      let ssid = this.valueToCode(block, 'SSID', this.ORDER_NONE);
      let pwd = this.valueToCode(block, 'PWD', this.ORDER_NONE);
      this.definitions_['variable_atmqtt'] = 'em::EspAtManager espAtManager(Serial);';
      this.definitions_['setup_serial_baudrate'] = 'Serial.begin(115200);';
      this.definitions_['setup_atmqtt'] = 'espAtManager.Init();';
      if (!isNaN(ssid)) {
        ssid = this.quote_(ssid);
      }
      if (!isNaN(pwd)) {
        pwd = this.quote_(pwd);
      }
      const code = `espAtManager.Wifi().ConnectWifi(${ssid}, ${pwd});\n`;
      return code;
    },
  },
  '---',
  {
    id: 'userConfig',
    text: (
      <Text
        id="blocks.c2mqtt.userConfig"
        defaultMessage="config MQTT client id:[ID] username:[USER] password:[PWD]"
      />
    ),
    inputs: {
      USER: {
        type: 'string',
        defaultValue: 'user',
      },
      PWD: {
        type: 'string',
        defaultValue: 'pass',
      },
      ID: {
        type: 'string',
        defaultValue: 'id',
      },
      // SCHEME: {
      //   menu: [
      //     ['TCP', 'em::EspAtMqtt::ConnectionScheme::kMqttOverTcp'],
      //     ['WebSocket', 'em::EspAtMqtt::ConnectionScheme::kMqttOverWebSocket'],
      //     ['WSS', 'em::EspAtMqtt::ConnectionScheme::kMqttOverWebSocketSecureNoVerify'],
      //   ],
      // },
    },
    ino(block) {
      const user = this.valueToCode(block, 'USER', this.ORDER_NONE);
      const pwd = this.valueToCode(block, 'PWD', this.ORDER_NONE);
      const id = this.valueToCode(block, 'ID', this.ORDER_NONE);
      // const scheme = block.getFieldValue('SCHEME');
      this.definitions_['setup_mqtt_userconfig'] =
        `espAtManager.Mqtt().UserConfig(em::EspAtMqtt::ConnectionScheme::kMqttOverTcp, ${id}, ${user}, ${pwd});`;
      return '';
    },
  },
  {
    id: 'connect',
    text: (
      <Text
        id="blocks.c2mqtt.connect"
        defaultMessage="connect to MQTT server:[SERVER] port:[PORT]"
      />
    ),
    inputs: {
      SERVER: {
        type: 'string',
        defaultValue: 'broker.emqx.io',
      },
      PORT: {
        type: 'positive_integer',
        defaultValue: 1883,
      },
    },
    ino(block) {
      const server = this.valueToCode(block, 'SERVER', this.ORDER_NONE);
      const port = this.valueToCode(block, 'PORT', this.ORDER_NONE);
      if (!this.definitions_['setup_mqtt_userconfig']) {
        this.definitions_['setup_mqtt_userconfig'] =
          `espAtManager.Mqtt().UserConfig(em::EspAtMqtt::ConnectionScheme::kMqttOverTcp, F("client_id"), F("user_name"), F("password"));`;
      }
      const code = `espAtManager.Mqtt().Connect(${server}, ${port});\n`;
      return code;
    },
  },
  '---',
  {
    id: 'publish',
    text: (
      <Text
        id="blocks.c2mqtt.publish"
        defaultMessage="publish message [MSG] to the topic [TOPIC] QoS [QOS]"
      />
    ),
    inputs: {
      MSG: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.c2mqtt.message1"
            defaultMessage="message 1"
          />
        ),
      },
      TOPIC: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.c2mqtt.topic1"
            defaultMessage="topic 1"
          />
        ),
      },
      QOS: {
        menu: 'QoS',
      },
    },
    ino(block) {
      const msg = this.valueToCode(block, 'MSG', this.ORDER_NONE);
      const topic = this.valueToCode(block, 'TOPIC', this.ORDER_NONE);
      const code = `espAtManager.Mqtt().Public(${topic}, ${msg});\n`;
      return code;
    },
  },
  {
    id: 'subscribe',
    text: (
      <Text
        id="blocks.c2mqtt.subscribe"
        defaultMessage="subscribes to topic [TOPIC] QoS [QOS]"
      />
    ),
    inputs: {
      TOPIC: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.c2mqtt.topic1"
            defaultMessage="topic 1"
          />
        ),
      },
      QOS: {
        menu: 'QoS',
      },
    },
    ino(block) {
      const topic = this.valueToCode(block, 'TOPIC', this.ORDER_NONE);
      const qos = block.getFieldValue('QOS');
      const code = `espAtManager.Mqtt().Subscribe(${topic}, ${qos});\n`;
      return code;
    },
  },
  {
    id: 'polling',
    text: (
      <Text
        id="blocks.c2mqtt.polling"
        defaultMessage="subscribes events polling"
      />
    ),
    ino(block) {
      this.definitions_['processSubscribe'] = ProcessSubscribeCode;
      this.definitions_['declare_processSubscribe'] = 'void processSubscribe();';
      const code = 'processSubscribe();\n';
      return code;
    },
  },
  '---',
  {
    id: 'whenTopic',
    text: (
      <Text
        id="blocks.c2mqtt.whenTopic"
        defaultMessage="when received for topic [TOPIC]"
      />
    ),
    hat: true,
    inputs: {
      TOPIC: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.c2mqtt.topic1"
            defaultMessage="topic 1"
          />
        ),
      },
    },
    ino(block) {
      if (!this.definitions_['processSubscribe']) {
        this.definitions_['processSubscribe'] = ProcessSubscribeCode;
        this.definitions_['declare_processSubscribe'] = 'void processSubscribe();';
      }

      const funcName = this.createName('subscribeTopic');
      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${funcName}`] = `void ${funcName}(const String &content);`;
      this.definitions_[funcName] = `void ${funcName}(const String &content) {\n${branchCode}}`;

      const topic = this.valueToCode(block, 'TOPIC', this.ORDER_NONE);
      this.definitions_['processSubscribe'] = this.definitions_['processSubscribe'].replace(
        ';\n}',
        `;\n  if (data.topic == ${topic}) return ${funcName}(content);\n}`,
      );
    },
  },
  {
    id: 'message',
    text: (
      <Text
        id="blocks.c2mqtt.message"
        defaultMessage="message content"
      />
    ),
    output: 'string',
    ino(block) {
      return ['content'];
    },
  },
];

export const menus = {
  QoS: {
    items: [
      [
        <Text
          id="blocks.c2mqtt.qos0"
          defaultMessage="most once"
        />,
        '0',
      ],
      [
        <Text
          id="blocks.c2mqtt.qos1"
          defaultMessage="least once"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.c2mqtt.qos2"
          defaultMessage="exactly once"
        />,
        '2',
      ],
    ],
  },
};
