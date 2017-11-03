function check_component(control_data, timeout_secs) {
  var _break_block = false;
  var _value = undefined
  function set_value(response) {
    //console.log('IN the callback: ' + JSON.stringify(response));
    _value = response['value'];
    _break_block = true;
  }
  // console.log('starting');
  // console.log(control_data);
  _check_component(control_data, set_value);
  var d = new Date().getTime();
  while(new Date().getTime() - d < timeout_secs*1000) {
    if(_break_block) {
      // console.log('BREAKING');
      break; }
  }
  //console.log('Returning: ' + _value);
  return(_value);
}

function _check_component(control_packet, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/board", false);
  xhr.setRequestHeader("Content-Type", "text/plain");
  xhr.onreadystatechange = function() {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      //console.log('POST CALL has returned: ' + xhr.response);
      callback(JSON.parse(xhr.response));
    }
  };
  xhr.send(control_packet);
}

