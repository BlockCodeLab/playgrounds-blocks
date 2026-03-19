import clogger_common_h from './files/clogger_common.h';
import clogger_h from './files/clogger.h';
import format_string_cpp from './files/format_string.cpp';
import format_string_h from './files/format_string.h';
import stream_util_cpp from './files/stream_util.cpp';
import stream_util_h from './files/stream_util.h';
import esp_at_lib_h from './files/esp_at_lib.h';
import esp_at_manager_cpp from './files/esp_at_manager.cpp';
import esp_at_manager_h from './files/esp_at_manager.h';
import esp_at_mqtt_cpp from './files/esp_at_mqtt.cpp';
import esp_at_mqtt_h from './files/esp_at_mqtt.h';
import esp_at_tcpip_cpp from './files/esp_at_tcpip.cpp';
import esp_at_tcpip_h from './files/esp_at_tcpip.h';
import esp_at_wifi_cpp from './files/esp_at_wifi.cpp';
import esp_at_wifi_h from './files/esp_at_wifi.h';
import result_code_cpp from './files/result_code.cpp';
import result_code_h from './files/result_code.h';

export const files = [
  { header: true, name: 'esp_at_manager.h', type: 'text/x-c', uri: esp_at_manager_h },
  { name: 'clogger_common.h', type: 'text/x-c', uri: clogger_common_h },
  { name: 'clogger.h', type: 'text/x-c', uri: clogger_h },
  { name: 'format_string.cpp', type: 'text/x-c', uri: format_string_cpp },
  { name: 'format_string.h', type: 'text/x-c', uri: format_string_h },
  { name: 'stream_util.cpp', type: 'text/x-c', uri: stream_util_cpp },
  { name: 'stream_util.h', type: 'text/x-c', uri: stream_util_h },
  { name: 'esp_at_lib.h', type: 'text/x-c', uri: esp_at_lib_h },
  { name: 'esp_at_manager.cpp', type: 'text/x-c', uri: esp_at_manager_cpp },
  { name: 'esp_at_mqtt.cpp', type: 'text/x-c', uri: esp_at_mqtt_cpp },
  { name: 'esp_at_mqtt.h', type: 'text/x-c', uri: esp_at_mqtt_h },
  { name: 'esp_at_tcpip.cpp', type: 'text/x-c', uri: esp_at_tcpip_cpp },
  { name: 'esp_at_tcpip.h', type: 'text/x-c', uri: esp_at_tcpip_h },
  { name: 'esp_at_wifi.cpp', type: 'text/x-c', uri: esp_at_wifi_cpp },
  { name: 'esp_at_wifi.h', type: 'text/x-c', uri: esp_at_wifi_h },
  { name: 'result_code.cpp', type: 'text/x-c', uri: result_code_cpp },
  { name: 'result_code.h', type: 'text/x-c', uri: result_code_h },
];
