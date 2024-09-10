// Playfair Cipher logic
function generateMatrix(key) {
  let matrix = [];
  let seen = new Set();
  key = key.replace(/j/g, "i");
  key = key + "abcdefghiklmnopqrstuvwxyz";

  for (let char of key) {
    if (!seen.has(char) && matrix.length < 25) {
      matrix.push(char);
      seen.add(char);
    }
  }

  return matrix;
}

function chunkText(text) {
  let result = [];
  text = text.replace(/j/g, "i");
  for (let i = 0; i < text.length; i += 2) {
    let first = text[i];
    let second = i + 1 < text.length ? text[i + 1] : "x";

    if (first === second) {
      result.push([first, "x"]);
      i--;
    } else {
      result.push([first, second]);
    }
  }
  return result;
}

function getPosition(matrix, char) {
  let index = matrix.indexOf(char);
  return [Math.floor(index / 5), index % 5];
}

function encryptText(text, key) {
  let matrix = generateMatrix(key);
  let pairs = chunkText(text.replace(/[^a-z]/g, "").toLowerCase());
  let result = "";

  pairs.forEach((pair) => {
    let [row1, col1] = getPosition(matrix, pair[0]);
    let [row2, col2] = getPosition(matrix, pair[1]);

    if (row1 === row2) {
      result += matrix[row1 * 5 + ((col1 + 1) % 5)];
      result += matrix[row2 * 5 + ((col2 + 1) % 5)];
    } else if (col1 === col2) {
      result += matrix[((row1 + 1) % 5) * 5 + col1];
      result += matrix[((row2 + 1) % 5) * 5 + col2];
    } else {
      result += matrix[row1 * 5 + col2];
      result += matrix[row2 * 5 + col1];
    }
  });

  return result;
}

function decryptText(text, key) {
  let matrix = generateMatrix(key);
  let pairs = chunkText(text.replace(/[^a-z]/g, "").toLowerCase());
  let result = "";

  pairs.forEach((pair) => {
    let [row1, col1] = getPosition(matrix, pair[0]);
    let [row2, col2] = getPosition(matrix, pair[1]);

    if (row1 === row2) {
      result += matrix[row1 * 5 + ((col1 + 4) % 5)];
      result += matrix[row2 * 5 + ((col2 + 4) % 5)];
    } else if (col1 === col2) {
      result += matrix[((row1 + 4) % 5) * 5 + col1];
      result += matrix[((row2 + 4) % 5) * 5 + col2];
    } else {
      result += matrix[row1 * 5 + col2];
      result += matrix[row2 * 5 + col1];
    }
  });

  return result;
}

// Event Listeners
document.getElementById("encrypt-btn").addEventListener("click", () => {
  const key = document.getElementById("key").value;
  const plaintext = document.getElementById("plaintext").value;
  const encryptedText = encryptText(plaintext, key);
  document.getElementById("result").value = encryptedText;
});

document.getElementById("decrypt-btn").addEventListener("click", () => {
  const key = document.getElementById("key").value;
  const ciphertext = document.getElementById("result").value;
  const decryptedText = decryptText(ciphertext, key);
  document.getElementById("result").value = decryptedText;
});
