'use strict';

var VALVE_HUE = 250;
var ABSOLUTE_MAX_TIMEOUT = 4;

vBlockly.Blocks['valve_open'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(VALVE_HUE);
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

  var code = ajax_test(timeout);//'alert("Timeout is: " + ' + timeout + ');\n';
  return code;
};
