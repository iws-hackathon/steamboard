'use strict';

var VALVE_HUE = 250;
var ABSOLUTE_MAX_TIMEOUT = 4;

Blockly.Blocks['valve_open'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(VALVE_HUE);
    this.appendValueInput('TIMEOUT')
      .appendField('Open the valve. Time out after')
      .setCheck('Number')
    this.appendDummyInput('_DUMMY_')
      .appendField('seconds')
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Use timeout t to force the operation to stop after t seconds');
  }
};

Blockly.Blocks['valve_close'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(VALVE_HUE);
    this.appendValueInput('TIMEOUT')
      .appendField('Close the valve. Time out after')
      .setCheck('Number')
    this.appendDummyInput('_DUMMY_')
      .appendField('seconds')
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Use timeout t to force the operation to stop after t seconds');
  }
};

Blockly.Blocks['valve_is_open'] = {
  init: function() {
    this.setOutput(true, 'Boolean');
    this.setColour(VALVE_HUE);
    this.setTooltip('True if the valve is completely open');
    this.setHelpUrl('');
    this.appendDummyInput('_DUMMY_')
      .appendField('valve is open')
  }
};

Blockly.Blocks['valve_is_closed'] = {
  init: function() {
    this.setOutput(true, 'Boolean');
    this.setColour(VALVE_HUE);
    this.setTooltip('True if the valve is completely open');
    this.setHelpUrl('');
    this.appendDummyInput('_DUMMY_')
      .appendField('valve is closed')
  }
};

Blockly.JavaScript['valve_open'] = function(block) {
  var timeout = Blockly.JavaScript.valueToCode(
      block, 'TIMEOUT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  if (timeout > ABSOLUTE_MAX_TIMEOUT) {
    console.log('Overriding valve timeout == ' + timeout + ' with the saner value: ' + ABSOLUTE_MAX_TIMEOUT);
    timeout = ABSOLUTE_MAX_TIMEOUT;
  }
  return [
    'check_component(\''+JSON.stringify(
      {
        'data': {
          'iws': {
            'valve': {
              'function': 'valve_open',
              'args': {
                'timeout': timeout
              }
            }
          }
        }
      }
    )+'\', 5)',
    Blockly.JavaScript.ORDER_EQUALITY
  ];
};

Blockly.JavaScript['valve_close'] = function(block) {
  var timeout = Blockly.JavaScript.valueToCode(
      block, 'TIMEOUT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  if (timeout > ABSOLUTE_MAX_TIMEOUT) {
    console.log('Overriding valve timeout == ' + timeout + ' with the saner value: ' + ABSOLUTE_MAX_TIMEOUT);
    timeout = ABSOLUTE_MAX_TIMEOUT;
  }
  return [
    'check_component(\''+JSON.stringify(
      {
        'data': {
          'iws': {
            'valve': {
              'function': 'valve_close',
              'args': {
                'timeout': timeout
              }
            }
          }
        }
      }
    )+'\', 5)',
    Blockly.JavaScript.ORDER_EQUALITY
  ];
};

Blockly.JavaScript['valve_is_open'] = function(block) {
  return [
    'check_component(\''+JSON.stringify(
      {
        'data': {
          'iws': {
            'valve': {
              'function': 'valve_is_open'
            }
          }
        }
      }
    )+'\', 5)',
    Blockly.JavaScript.ORDER_EQUALITY
  ];
};

Blockly.JavaScript['valve_is_closed'] = function(block) {
  return [
    'check_component(\''+JSON.stringify(
      {
        'data': {
          'iws': {
            'valve': {
              'function': 'valve_is_closed'
            }
          }
        }
      }
    )+'\', 5)',
    Blockly.JavaScript.ORDER_EQUALITY
  ];
};
