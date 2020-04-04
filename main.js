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

  function processChild(node, knownSentences) {
    const totalSentences = {};
    for (let i = 0; i < node.children.length; i++) {
      const sentences = cldrSegmentation.sentenceSplit(
        node.children[i].innerText || ""
      );
      const childMap = {};
      for (const sentence of sentences) {
        totalSentences[sentence] = true;
        if (knownSentences[sentence]) {
          childMap[sentence] = node.children[i];
        }
      }

      const lost = processChild(node.children[i], childMap);
      for (const sentence of Object.keys(childMap)) {
        if (
          lost[sentence] &&
          node.children[i].nodeName.toLowerCase() !== "img" &&
          node.children[i].nodeName.toLowerCase() !== "iframe" &&
          node.children[i].nodeName.toLowerCase() !== "script" &&
          node.children[i].nodeName.toLowerCase() !== "style" &&
          node.children[i].nodeName.toLowerCase() !== "svg" &&
          node.children[i].nodeName.toLowerCase() !== "noscript" &&
          node.children[i].nodeName.toLowerCase() !== "footer"
        ) {
          node.children[
            i
          ].innerHTML = `<mark style="background-color: ${getRandomColor()}">${
            node.children[i].innerHTML
          }</mark>`;
        }
      }
    }

    const lostSentences = {};
    // console.log(totalSentences, node);
    for (const sentence of Object.keys(knownSentences)) {
      if (
        !totalSentences[sentence] &&
        node.nodeName.toLowerCase() !== "img" &&
        node.nodeName.toLowerCase() !== "iframe" &&
        node.nodeName.toLowerCase() !== "script" &&
        node.nodeName.toLowerCase() !== "style" &&
        node.nodeName.toLowerCase() !== "svg" &&
        node.nodeName.toLowerCase() !== "noscript" &&
        node.nodeName.toLowerCase() !== "footer"
      ) {
        console.log(
          node,
          sentence,
          totalSentences[sentence],
          knownSentences[sentence]
        );
        lostSentences[sentence] = node;
      }
    }

    return lostSentences;
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
