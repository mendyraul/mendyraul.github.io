let sessionPrivateKeyPrime = null

function getMode() {
  const modeSelect = document.getElementById("mode-select")

  return modeSelect.options[modeSelect.selectedIndex].value;
}
///SHIT THAT WORKS DONT TOUCH!

function getPrivateKey(callback) {
  const privateKeyInput = document.getElementById("pKey")
  let privateKeyValue = privateKeyInput.value

  if (!privateKeyValue) {
    if (sessionPrivateKeyPrime !== null) {
      callback(sessionPrivateKeyPrime)
      return
    }

    randomPrime(callback)
  }
  else callback(privateKeyValue)
}
///SHIT THAT WORKS DONT TOUCH!

function getEncryptionAlgo() {
  const encryptionAlgoSelect = document.getElementById("encryption_algorithm")

  return encryptionAlgoSelect.options[encryptionAlgoSelect.selectedIndex].text
}
///SHIT THAT WORKS DONT TOUCH!

function encrypt() {
  const plainTextInput = document.getElementById("input");
  const plainText = plainTextInput.value;

  if (!plainText) {
    alert('Please enter some text to encrypt');

    return;
  }
  
  getPrivateKey((privateKeyValue) => {
    if (privateKeyValue.trim() === "") {
      alert("Please enter the private key")
    }
  
    const ciphertext = CryptoJS[getEncryptionAlgo()].encrypt(plainText, privateKeyValue, {
      mode: CryptoJS.mode[getMode()]
    }).toString();
  
    const output = document.getElementById("decrypt-input")
  
    output.value = ciphertext;
  })
}
///SHIT THAT WORKS DONT TOUCH!

function decrypt() {
  const cipherTextInput = document.getElementById("decrypt-input");
  const cipherText = cipherTextInput.value;

  if (!cipherText) {
    alert('Please enter some text to decrypt');

    return;
  }

  getPrivateKey((privateKeyValue) => {
    if (privateKeyValue.trim() === "") {
      alert("Please enter the private key")
    }
  
    const plainText = CryptoJS[getEncryptionAlgo()].decrypt(cipherText, privateKeyValue, {
      mode: CryptoJS.mode[getMode()]
    }).toString(CryptoJS.enc.Utf8);
  
    if (!plainText) {
      alert("Could not decrypt. Maybe decryption algorithm or mode of operation is wrong?")
  
      return
    }
  
    const output = document.getElementById("input")
  
    output.value = plainText;
  })
}
///SHIT THAT WORKS DONT TOUCH!
//This is used to generate a random prime number for the Public key encryptions.
function randomPrime(callback) {
  const bits = 256;

  forge.prime.generateProbablePrime(bits, function(err, num) {
    const numStr = num.toString(10)

    sessionPrivateKeyPrime = numStr
    callback(numStr)
  });
}