function init() {
  "use strict";
  const node = document.body;

  const nodeNames = [
    "img",
    "iframe",
    "script",
    "style",
    "svg",
    "li",
    "noscript",
    "ul",
    "footer",
  ];
  var count = 0;
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function processChild(node, sentenceMap) {
    const children = {};
    for (let i = 0; i < node.children.length; i++) {
      var sentences = cldrSegmentation.sentenceSplit(
        node.children[i].innerText || ""
      );
      const childMap = {};
      for (const sentence of sentences) {
        if (sentenceMap[sentence]) {
          children[sentence] = node.children[i];
          childMap[sentence] = node.children[i];
        }
      }
      if (nodeNames.includes(node.children[i].nodeName)) {
        continue;
      }

      processChild(node.children[i], childMap);
    }

    const result = {};
    for (const sentence of Object.keys(sentenceMap)) {
      if (!children[sentence] && !nodeNames.includes(node.nodeName)) {
        count++;
        // theoretically, this node contains the sentence cleanly.
        console.log(node, sentence);
        result[sentence] = node;
        //console.log(count);
      }
    }
    return result;
  }

  function processNode(node) {
    if (!node.innerText) {
      return;
    }

    if (node.innerText) {
      for (let i = 0; i < node.children.length; i++) {
        if (nodeNames.includes(node.children[i].nodeName)) {
          continue;
        }

        console.log(node.children[i].nodeName);
        const sentenceMap = {};
        var sentences = cldrSegmentation.sentenceSplit(
          node.children[i].innerText
        );

        for (const sentence of sentences) {
          sentenceMap[sentence] = node.children[i];
        }

        processChild(node.children[i], sentenceMap);
      }
    }
  }

  function getInputs() {
    // add inputs here
    var inputs = new Tensor(new Float32Array([1.0, 2.0, 3.0, 4.0]), "float32", [
      2,
      2,
    ]);
    return inputs;
  }

  function run_model() {
    console.log("running_");
    const myOnnxSession = new onnx.InferenceSession();
    // load the ONNX model file
    //
    const model_url = chrome.runtime.getURL("ml/bidaf-9.onnx");

    myOnnxSession.loadModel(model_url).then(() => {
      // generate model input
      const inferenceInputs = getInputs();
      // execute the model
      session.run(inferenceInputs).then((output) => {
        // consume the output
        const outputTensor = output.values().next().value;
        console.log(`model output tensor: ${outputTensor.data}.`);
      });
    });
  }

  function init() {
    run_model();
    processNode(node);
  }

  chrome.runtime.onMessage.addListener(function (
    messageBody,
    sender,
    sendResponse
  ) {
    init();
    chrome.runtime.sendMessage({ type: "setCount", count: count });
  });
}

init();
window.init = init;
