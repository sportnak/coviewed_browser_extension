!(function() {
  "use strict";
  const node = document.body;

  function processNode(node) {
    if (node.text && node.text.includes("highlight")) {
      return;
    }

    if (node.nodeName === "SCRIPT" || node.nodeName === "IMG") {
      return;
    }

    if (node.children.length === 0) {
      var sentences = cldrSegmentation.sentenceSplit(node.innerHTML);
      const result = [];
      for (const sentence of sentences) {
        if (sentence.indexOf("covid") !== -1) {
          result.push(`<mark>${sentence}</mark>`);
        } else {
          result.push(sentence);
        }
      }
      node.innerHTML = result.join("");
      return;
    }

    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i]) {
        processNode(node.children[i]);
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
})();
