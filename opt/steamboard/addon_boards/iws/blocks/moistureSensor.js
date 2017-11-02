'use strict';

var MS_HUE = 240;

Blockly.Blocks['it_is_moist'] = {
  init: function() {
    this.setOutput(true, 'Boolean');
    this.setColour(MS_HUE);
    this.setTooltip('True if the moisture sensor is activated');
    this.setHelpUrl('');
    this.appendDummyInput('_DUMMY_')
      .appendField('it is moist')
  }
};

Blockly.JavaScript['it_is_moist'] = function(block) {
  return [
    'check_component(\''+JSON.stringify(
      {
        'data': {
          'iws': {
            'moistureSensor': {
              'function': 'it_is_moist'
            }
          }
        }
      }
    )+'\', 5)',
    Blockly.JavaScript.ORDER_EQUALITY
  ];
};
