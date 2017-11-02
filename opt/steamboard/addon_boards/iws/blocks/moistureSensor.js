'use strict';

var MS_HUE = 250;

Blockly.Blocks['valve_open'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(MS_HUE);
    this.appendValueInput("TIMEOUT")
      .appendField('Close valve. Timeout =')
      .setCheck("Number")
    this.appendDummyInput("NUFIN")
      .appendField('seconds')
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
  }
};

Blockly.JavaScript['valve_open'] = function(block) {
  var timeout = Blockly.JavaScript.valueToCode(
      block, 'TIMEOUT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var code = ajax_test(timeout);
  return code;
};
