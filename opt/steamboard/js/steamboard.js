var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');

var demoWorkspace = Blockly.inject(
    'blocklyDiv',
    {
        media: 'blockly/media/',
        toolbox: document.getElementById('toolbox')
    });
Blockly.Xml.domToWorkspace(
    document.getElementById('startBlocks'),
    demoWorkspace
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
  console.log("TOP: " + controlsDiv.style.top + " LEFT: " + controlsDiv.style.left + " HEIGHT: " + controlsDiv.style.height);

  controlsDiv.style.top = (blocklyDiv.style.height - controlsHeight) + 'px';
  controlsDiv.style.left = '0px';
  //controlsDiv.style.height = controlsHeight + 'px';

  console.log("TOP: " + controlsDiv.style.top + " LEFT: " + controlsDiv.style.left + " HEIGHT: " + controlsDiv.style.height);
  Blockly.svgResize(demoWorkspace);
};

function showCode() {
  // Generate JavaScript code and display it.
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  var code = Blockly.JavaScript.workspaceToCode(demoWorkspace);
  alert(code);
}

function runCode() {
  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;
  Blockly.JavaScript.INFINITE_LOOP_TRAP =
      'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
  var code = Blockly.JavaScript.workspaceToCode(demoWorkspace);
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
    var xml = Blockly.Xml.workspaceToDom(demoWorkspace);
    var xml_text = Blockly.Xml.domToText(xml);

    dataAsNamedDownload(xml_text, "blockly_save.xml")
}

function handleFileUploadChange(files) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var xml = Blockly.Xml.textToDom(event.target.result);
        demoWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, demoWorkspace);
    }
    reader.readAsText(files[0]);
}

window.addEventListener('resize', onresize, false);
window.addEventListener('orientationchange', onresize, false);
onresize();
