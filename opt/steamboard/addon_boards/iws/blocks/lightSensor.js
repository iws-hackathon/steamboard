'use strict';

var MS_HUE = 230;

Blockly.Blocks['it_is_dark'] = {
  init: function() {
    this.setOutput(true, 'Boolean');
    this.setColour(MS_HUE);
    this.setTooltip('True if the moisture sensor is activated');
    this.setHelpUrl('');
    this.appendDummyInput('_DUMMY_')
      .appendField('it is moist')
  }
};

Blockly.JavaScript['it_is_dark'] = function(block) {
  return [
    'check_component(\''+JSON.stringify(
      {
        'data': {
          'iws': {
            'lightSensor': {
              'function': 'it_is_dark'
            }
          }
        }
      }
    )+'\', 5)',
    Blockly.JavaScript.ORDER_EQUALITY
  ];
};
