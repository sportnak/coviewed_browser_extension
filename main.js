const node = document.body;
processNode(node);

function processNode(node) {
  if (node.text && node.text.includes("highlight")) {
    return;
  }

  if (node.nodeName === "script") {
    return;
  }

  if (node.children.length === 0) {
    if (node.innerHTML.includes("highlight")) {
      let index = 0;
      const indices = [];
      let timedout = false;
      const timer = setTimeout(() => {
        timedout = true;
        // just in case we accidentally loop.
      }, 5000);

      while (index !== -1 && !timedout) {
        index = node.innerHTML.indexOf("highlight", index);
        if (index !== -1) {
          indices.push(index);
          index += 9;
        }
      }

      // descending order
      indices.sort((a, b) => b - a);
      clearTimeout(timer);
      for (let i = 0; i < indices.length; i++) {
        node.innerHTML =
          node.innerHTML.substring(0, indices[i]) +
          "<mark>highlight</mark>" +
          node.innerHTML.substring(indices[i] + 9);
      }
    }
    return;
  }

  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i]) {
      processNode(node.children[i]);
    }
  }
}
