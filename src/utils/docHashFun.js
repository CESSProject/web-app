import CryptoJS from "crypto-js";
function readBinaryChunked(file, chunkCallback, endCallback) {
  // console.log("file", file);
  const fileSize = file.size;
  // console.log("fileSize", fileSize);

  const chunkSize = 4 * 1024 * 1024; // 4MB
  let offset = 0;

  const reader = new FileReader();
  reader.onload = () => {
    if (reader.error) {
      endCallback(reader.error || {});
      return;
    }
    offset += reader.result.byteLength;
    try {
      chunkCallback(reader.result, offset, fileSize);
    } catch (err) {
      endCallback(err);
      return;
    }
    if (offset >= fileSize) {
      endCallback(null);
      return;
    }
    readNext();
  };

  reader.onerror = (err) => {
    endCallback(err || {});
  };

  function readNext() {
    const fileSlice = file.slice(offset, offset + chunkSize);
    reader.readAsArrayBuffer(fileSlice);
  }
  readNext();
}


export function getMD5(blob, cbProgress) {
  return new Promise((resolve, reject) => {
    const md5 = CryptoJS.algo.MD5.create();
    readBinaryChunked(
      blob,
      (chunk, offs, total) => {
        md5.update(CryptoJS.lib.WordArray.create(chunk));
        if (cbProgress) {
          cbProgress(offs / total);
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          // const hash = md5.finalize();
          // const hashHex = hash.toString(CryptoJS.enc.Hex);
          // resolve(hashHex);
          const digest = md5.finalize();
          resolve(digest.toString());
        }
      }
    );
  });
}

export function getSHA256(blob, cbProgress) {
  return new Promise((resolve, reject) => {
    const sha256 = CryptoJS.algo.SHA256.create();
    readBinaryChunked(
      blob,
      (chunk, offs, total) => {
        sha256.update(CryptoJS.lib.WordArray.create(chunk));
        if (cbProgress) {
          cbProgress(offs / total);
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          // const hash = sha256.finalize();
          // const hashHex = hash.toString(CryptoJS.enc.Hex);
          // resolve(hashHex);
          const digest = sha256.finalize();
          resolve(digest.toString());
        }
      }
    );
  });
}

export function getSHA1(blob, cbProgress) {
  return new Promise((resolve, reject) => {
    const sha1 = CryptoJS.algo.SHA1.create();
    readBinaryChunked(
      blob,
      (chunk, offs, total) => {
        sha1.update(CryptoJS.lib.WordArray.create(chunk));
        if (cbProgress) {
          cbProgress(offs / total);
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          // const hash = sha1.finalize();
          // const hashHex = hash.toString(CryptoJS.enc.Hex);
          // resolve(hashHex);
          const digest = sha1.finalize();
          resolve(digest.toString());
        }
      }
    );
  });
}

export function getSHA512(blob, cbProgress) {
  return new Promise((resolve, reject) => {
    const sha512 = CryptoJS.algo.SHA512.create();
    readBinaryChunked(
      blob,
      (chunk, offs, total) => {
        sha512.update(CryptoJS.lib.WordArray.create(chunk));
        if (cbProgress) {
          cbProgress(offs / total);
        }
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          // const hash = sha512.finalize();
          // const hashHex = hash.toString(CryptoJS.enc.Hex);
          // resolve(hashHex);
          const digest = sha512.finalize();
          resolve(digest.toString());
        }
      }
    );
  });
}
