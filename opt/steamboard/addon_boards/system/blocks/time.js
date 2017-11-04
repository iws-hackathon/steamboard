'use strict';

var TIME_HUE = 150;

Blockly.Blocks['sleep'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(TIME_HUE);
    this.appendValueInput('TIMEOUT')
      .appendField('Wait for')
      .setCheck('Number')
    this.appendDummyInput('_DUMMY_')
      .appendField('seconds')
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Wait for t seconds');
  }
};

Blockly.JavaScript['sleep'] = function(block) {
  var timeout = Blockly.JavaScript.valueToCode(
      block, 'TIMEOUT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return 'check_component(\''+JSON.stringify(
      {
        'data': {
          'system': {
            'time': {
              'function': 'sleep',
              'args': {
                'timeout': timeout
              }
            }
          }
        }
      }
    )+'\', 5)';
};

