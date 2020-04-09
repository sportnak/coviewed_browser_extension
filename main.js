function derp() {
  "use strict";
  const node = document.body;
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function processNode(node) {
    if (!node.innerText) {
      return;
    }

    if (node.innerText) {
      for (let i = 0; i < node.children.length; i++) {
        if (
          node.children[i].nodeName.toLowerCase() === "img" ||
          node.children[i].nodeName.toLowerCase() === "iframe" ||
          node.children[i].nodeName.toLowerCase() === "script" ||
          node.children[i].nodeName.toLowerCase() === "style" ||
          node.children[i].nodeName.toLowerCase() === "svg"
        ) {
          continue;
        }

        const sentenceMap = {};
        var sentences = cldrSegmentation.sentenceSplit(
          node.children[i].innerText
        );
        const instance = new Mark(node.children[i]);
        for (const sentence of sentences) {
          instance.mark(sentence, {
            acrossElements: true,
            separateWordSearch: false
          });
        }
      }
    }
  }

  function getInputs() {
    // add inputs here
    var inputs = new Tensor(new Float32Array([1.0, 2.0, 3.0, 4.0]), "float32", [
      2,
      2
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
      session.run(inferenceInputs).then(output => {
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

  chrome.runtime.onMessage.addListener(function(
    messageBody,
    sender,
    sendResponse
  ) {
    init();
  });
}

derp();
window.derp = derp;
