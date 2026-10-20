function getMode() {
  return document.getElementById("mode-select").value;
}

function getEncryptionAlgo() {
  return document.getElementById("encryption_algorithm").value;
}

function cryptoStatus(message, state = "error", field = null) {
  const status = document.getElementById("cryptoStatus");
  status.textContent = message;
  status.dataset.state = state;
  document.querySelectorAll('.encryption-main [aria-invalid="true"]').forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

function getPrivateKey() {
  const field = document.getElementById("pKey");
  if (!field.value.trim()) {
    cryptoStatus("Enter a key before encrypting or decrypting.", "error", field);
    return null;
  }
  // Preserve spaces in a supplied key so earlier ciphertexts still decrypt.
  return field.value;
}

function encryptionReady() {
  if (typeof CryptoJS === "undefined") {
    cryptoStatus("The encryption library didn’t load. Refresh the page and try again.");
    return false;
  }
  return true;
}

function encrypt() {
  const key = getPrivateKey();
  if (key === null || !encryptionReady()) return;
  const input = document.getElementById("input");
  if (!input.value) {
    cryptoStatus("Enter some text to encrypt.", "error", input);
    return;
  }
  try {
    const ciphertext = CryptoJS[getEncryptionAlgo()].encrypt(input.value, key, {
      mode: CryptoJS.mode[getMode()]
    }).toString();
    document.getElementById("decrypt-input").value = ciphertext;
    cryptoStatus("Encrypted text is ready. Keep your key to decrypt it later.", "success");
  } catch (_) {
    cryptoStatus("Couldn’t encrypt this text. Check the settings and try again.");
  }
}

function decrypt() {
  const key = getPrivateKey();
  if (key === null || !encryptionReady()) return;
  const input = document.getElementById("decrypt-input");
  const ciphertext = input.value.replace(/\s/g, "");
  if (!ciphertext) {
    cryptoStatus("Enter some encrypted text to decrypt.", "error", input);
    return;
  }
  try {
    // The existing app produces salted OpenSSL-format base64 through CryptoJS.
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(ciphertext) || ciphertext.length % 4 !== 0) {
      throw new Error("Invalid ciphertext");
    }
    const algorithm = getEncryptionAlgo();
    const blockBytes = CryptoJS.algo[algorithm].blockSize * 4;
    const parsed = CryptoJS.format.OpenSSL.parse(ciphertext);
    if (!parsed.salt || parsed.salt.sigBytes !== 8 || parsed.ciphertext.sigBytes === 0 ||
        parsed.ciphertext.sigBytes % blockBytes !== 0) {
      throw new Error("Invalid ciphertext");
    }
    const bytes = CryptoJS[algorithm].decrypt(parsed, key, {
      mode: CryptoJS.mode[getMode()],
      padding: {
        unpad(data) {
          // CryptoJS otherwise removes unchecked padding, sometimes hiding a wrong key.
          const byteAt = (index) => (data.words[index >>> 2] >>> (24 - (index % 4) * 8)) & 255;
          const count = byteAt(data.sigBytes - 1);
          if (count < 1 || count > blockBytes || count > data.sigBytes) throw new Error("Invalid padding");
          for (let i = data.sigBytes - count; i < data.sigBytes; i += 1) {
            if (byteAt(i) !== count) throw new Error("Invalid padding");
          }
          CryptoJS.pad.Pkcs7.unpad(data);
        }
      }
    });
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    if (!plaintext) throw new Error("No plaintext");
    document.getElementById("input").value = plaintext;
    cryptoStatus("Decrypted text is ready.", "success");
  } catch (_) {
    cryptoStatus("Couldn’t decrypt this message. Check the key, algorithm, mode, and encrypted text.", "error", input);
  }
}

document.getElementById("encryptBtn").addEventListener("click", encrypt);
document.getElementById("decryptBtn").addEventListener("click", decrypt);
