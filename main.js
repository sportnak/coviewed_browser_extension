!(function() {
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
    if (node.text && node.text.includes("coronavirus")) {
      return;
    }

    if (node.nodeName === "SCRIPT" || node.nodeName === "IMG") {
      return;
    }

    if (node.children.length === 0) {
      var sentences = cldrSegmentation.sentenceSplit(node.innerHTML);
      const result = [];
      for (const sentence of sentences) {
        result.push(
          `<mark style="background-color: ${getRandomColor()};">${sentence}</mark>`
        );
        // if (sentence.indexOf("coronavirus") !== -1) {
        // } else {
        //   result.push(sentence);
        // }
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
