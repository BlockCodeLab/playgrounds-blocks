import { Text } from '@blockcode/core';

const MQTT_CLIENT_PLACEHOLDER = 'mqttclient = None';

const MqttGlobalsCode = [
  'mqtt_messages = {}',
  'mqtt_flags = {}',
  'mqtt_topics = set()',
  "mqtt_last_message = ''",
  '',
].join('\n');

const MqttTopicMatchCode = [
  'def mqtt_topic_match(filter, topic):',
  "  filter_parts = filter.split('/')",
  "  topic_parts = topic.split('/')",
  '  for i, part in enumerate(filter_parts):',
  "    if part == '#':",
  '      return True',
  '    if i >= len(topic_parts):',
  '      return False',
  "    if part != '+' and part != topic_parts[i]:",
  '      return False',
  '  return len(filter_parts) == len(topic_parts)',
  '',
].join('\n');

const MqttOnMessageCode = [
  'def mqtt_on_message(topic, msg):',
  '  global mqtt_last_message',
  '  topic = topic.decode()',
  '  msg = msg.decode()',
  '  mqtt_last_message = msg',
  '  mqtt_messages[topic] = msg',
  '  for filter, flags in mqtt_flags.items():',
  '    if mqtt_topic_match(filter, topic):',
  '      mqtt_messages[filter] = msg',
  '      for flag in flags:',
  '        flag.set()',
  '',
].join('\n');

const MqttReconnectCode = [
  'def mqtt_reconnect():',
  '  mqttclient.connect()',
  '  for topic, qos in mqtt_topics:',
  '    mqttclient.subscribe(topic, qos=qos)',
  '',
].join('\n');

const MqttPublishCode = [
  'def mqtt_publish(topic, msg, qos=0):',
  '  try:',
  '    mqttclient.publish(topic, msg, qos=qos)',
  '  except OSError:',
  '    mqtt_reconnect()',
  '    mqttclient.publish(topic, msg, qos=qos)',
  '',
].join('\n');

const MqttSubscribeCode = [
  'def mqtt_subscribe(topic, qos=0):',
  '  mqttclient.set_callback(mqtt_on_message)',
  '  mqtt_topics.add((topic, qos))',
  '  try:',
  '    mqttclient.subscribe(topic, qos=qos)',
  '  except OSError:',
  '    mqtt_reconnect()',
  '',
].join('\n');

const MqttProcessCode = [
  '@_tasks__.append',
  'async def mqtt_process():',
  '  last_ping = time.ticks_ms()',
  '  while True:',
  '    if mqttclient is not None and mqttclient.sock:',
  '      try:',
  '        mqttclient.check_msg()',
  '        if time.ticks_diff(time.ticks_ms(), last_ping) >= 30000:',
  '          mqttclient.ping()',
  '          last_ping = time.ticks_ms()',
  '      except Exception:',
  '        try:',
  '          mqtt_reconnect()',
  '          last_ping = time.ticks_ms()',
  '        except Exception:',
  '          await asyncio.sleep_ms(1000)',
  '    await asyncio.sleep_ms(50)',
  '',
].join('\n');

const mqttClientIdCode = (idCode) => `str(${idCode}) + '_' + ubinascii.hexlify(machine.unique_id()).decode()`;

const ensureMqttClient = (defs) => {
  if (!defs['mqttclient']) {
    defs['mqttclient'] = MQTT_CLIENT_PLACEHOLDER;
  }
};

const ensureMqttHelper = (defs) => {
  ensureMqttClient(defs);
  defs['mqtt_globals'] ??= MqttGlobalsCode;
  defs['mqtt_topic_match'] ??= MqttTopicMatchCode;
  defs['mqtt_on_message'] ??= MqttOnMessageCode;
  defs['mqtt_reconnect'] ??= MqttReconnectCode;
};

const ensureMqttProcess = (defs) => {
  defs['mqtt_process'] ??= MqttProcessCode;
};

export const blocks = [
  {
    id: 'userConfig',
    text: (
      <Text
        id="blocks.mqtt.userConfig"
        defaultMessage="config MQTT client id:[ID] username:[USER] password:[PWD]"
      />
    ),
    inputs: {
      ID: {
        type: 'string',
        defaultValue: 'id',
      },
      USER: {
        type: 'string',
        defaultValue: 'user',
      },
      PWD: {
        type: 'string',
        defaultValue: 'pass',
      },
    },
    mpy(_, args, defs) {
      defs['import_mqtt'] = 'from umqtt.simple import MQTTClient';
      defs['import_machine'] = 'import machine';
      defs['import_ubinascii'] = 'import ubinascii';
      defs['mqttclient'] =
        `mqttclient = MQTTClient(${mqttClientIdCode(args.ID)}, 'broker.emqx.io', user=${args.USER}, password=${args.PWD}, keepalive=60)`;
      return '';
    },
  },
  {
    id: 'connect',
    text: (
      <Text
        id="blocks.mqtt.connect"
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
    mpy(_, args, defs) {
      ensureMqttHelper(defs);
      ensureMqttProcess(defs);
      defs['import_mqtt'] = 'from umqtt.simple import MQTTClient';
      defs['import_machine'] = 'import machine';
      defs['import_ubinascii'] = 'import ubinascii';
      if (!defs['mqttclient'] || defs['mqttclient'] === MQTT_CLIENT_PLACEHOLDER) {
        defs['mqttclient'] =
          `mqttclient = MQTTClient(${mqttClientIdCode("'id'")}, ${args.SERVER}, port=${args.PORT}, keepalive=60)`;
      }

      let code = '';
      code += `mqttclient.server = ${args.SERVER}\n`;
      code += `mqttclient.port = ${args.PORT}\n`;
      code += 'mqttclient.connect()\n';
      return code;
    },
  },
  '---',
  {
    id: 'publish',
    text: (
      <Text
        id="blocks.mqtt.publish"
        defaultMessage="publish message [MSG] to the topic [TOPIC] QoS [QOS]"
      />
    ),
    inputs: {
      MSG: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.mqtt.message1"
            defaultMessage="message 1"
          />
        ),
      },
      TOPIC: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.mqtt.topic1"
            defaultMessage="topic 1"
          />
        ),
      },
      QOS: {
        menu: 'QoS',
      },
    },
    mpy(_, args, defs) {
      ensureMqttHelper(defs);
      ensureMqttProcess(defs);
      defs['mqtt_publish'] ??= MqttPublishCode;
      const code = `mqtt_publish(str(${args.TOPIC}).encode(), str(${args.MSG}).encode(), qos=${args.QOS})\n`;
      return code;
    },
  },
  {
    id: 'subscribe',
    text: (
      <Text
        id="blocks.mqtt.subscribe"
        defaultMessage="subscribes to topic [TOPIC] QoS [QOS]"
      />
    ),
    inputs: {
      TOPIC: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.mqtt.topic1"
            defaultMessage="topic 1"
          />
        ),
      },
      QOS: {
        menu: 'QoS',
      },
    },
    mpy(_, args, defs) {
      ensureMqttHelper(defs);
      ensureMqttProcess(defs);
      defs['mqtt_subscribe'] ??= MqttSubscribeCode;

      const code = `mqtt_subscribe(str(${args.TOPIC}).encode(), qos=${args.QOS})\n`;
      return code;
    },
  },
  '---',
  {
    id: 'whenTopic',
    text: (
      <Text
        id="blocks.mqtt.whenTopic"
        defaultMessage="when received for topic [TOPIC]"
      />
    ),
    hat: true,
    inputs: {
      TOPIC: {
        type: 'string',
        defaultValue: (
          <Text
            id="blocks.mqtt.topic1"
            defaultMessage="topic 1"
          />
        ),
      },
    },
    mpy(block, args, defs) {
      ensureMqttHelper(defs);
      ensureMqttProcess(defs);

      const flagName = this.createName('mqtt_flag');
      defs[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      const branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      let taskCode = this.addEventTrap(this.prefixLines(code, this.INDENT), `mqtt_${block.id}`);
      taskCode = '@_tasks__.append\n' + taskCode;
      defs[`${flagName}_task`] = taskCode;

      // 在主程序中注册监听，保证使用变量主题时变量已完成初始化
      return `mqtt_flags.setdefault(${args.TOPIC}, []).append(${flagName})\n`;
    },
  },
  {
    id: 'message',
    text: (
      <Text
        id="blocks.mqtt.message"
        defaultMessage="message content"
      />
    ),
    output: 'string',
    mpy(block, _, defs) {
      ensureMqttHelper(defs);
      const rootBlock = block.getRootBlock();
      if (rootBlock?.type?.endsWith('_whenTopic')) {
        const topic = this.valueToCode(rootBlock, 'TOPIC', this.ORDER_NONE);
        return [`mqtt_messages.get(${topic}, '')`, this.ORDER_FUNCTION_CALL];
      }
      return ['mqtt_last_message', this.ORDER_ATOMIC];
    },
  },
];

export const menus = {
  QoS: {
    items: [
      [
        <Text
          id="blocks.mqtt.qos0"
          defaultMessage="most once"
        />,
        '0',
      ],
      [
        <Text
          id="blocks.mqtt.qos1"
          defaultMessage="least once"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.mqtt.qos2"
          defaultMessage="exactly once"
        />,
        '2',
      ],
    ],
  },
};
