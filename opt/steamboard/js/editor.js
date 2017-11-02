var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');

var steamBoardWorkspace = Blockly.inject(
  'blocklyDiv',
  {
    media: 'blockly/media/',
    toolbox: document.getElementById('toolbox')
  }
);

Blockly.Xml.domToWorkspace(
  document.getElementById('startBlocks'),
  steamBoardWorkspace
);

var onresize = function(e) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';


  var controlsHeight = 40;
  var controlsDiv = document.getElementById('userControlsDiv');

  controlsDiv.style.top = (blocklyDiv.style.height - controlsHeight) + 'px';
  controlsDiv.style.left = '0px';

  Blockly.svgResize(steamBoardWorkspace);
};

function showCode() {
  // Generate JavaScript code and display it.
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  var code = Blockly.JavaScript.workspaceToCode(steamBoardWorkspace);
  alert(code);
}

function runCode() {
  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;
  Blockly.JavaScript.INFINITE_LOOP_TRAP =
      'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
  var code = Blockly.JavaScript.workspaceToCode(steamBoardWorkspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(e);
  }
}

function downloadNamedURL(data, name) {
    var hiddenIFrameID = 'hiddenDownloader';
    var download_div = document.getElementById(hiddenIFrameID);
    if (download_div === null) {
        download_div = document.createElement('div');
        download_div.id = hiddenIFrameID;
        download_div.style.display = 'none';
        document.body.appendChild(download_div);
    }
    download_div.innerHTML = "";
    var link = document.createElement('a');

    link.setAttribute("href", data);
    link.setAttribute("download", name);
    download_div.appendChild(link);
    link.click();
};

function dataAsNamedDownload(data, name) {
    downloadNamedURL('data:text/tab-separated-values;base64,' + window.btoa(data), name);
}

function downloadWorkspace() {
    var xml = Blockly.Xml.workspaceToDom(steamBoardWorkspace);
    var xml_text = Blockly.Xml.domToText(xml);

    dataAsNamedDownload(xml_text, "blockly_save.xml")
}

function handleFileUploadChange(files) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var xml = Blockly.Xml.textToDom(event.target.result);
        steamBoardWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, steamBoardWorkspace);
    }
    reader.readAsText(files[0]);
}

window.addEventListener('resize', onresize, false);
window.addEventListener('orientationchange', onresize, false);
onresize();
