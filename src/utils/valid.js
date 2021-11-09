export function validEmail(val) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(val)
}

export function validPass(val) {
  return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(val);
  // return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(val);
  // return /^.{6,16}$/.test(val);
}

export function validCode(val) {
  return /^[0-9]{6}$/.test(val);
}



export function isAllMoney(obj) {
  obj.target.value = obj.target.value.replace(/[^\d.]/g, ""); 
  obj.target.value = obj.target.value.replace(/^\./g, ""); 
  obj.target.value = obj.target.value.replace(/\.{2,}/g, "."); 
  obj.target.value = obj.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  obj.target.value = obj.target.value.replace(/^()*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');
  return obj.target.value;
}

// Unit conversion
export function renderSize(size) {
	let value = size;
	let unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let srcsize = parseFloat(value);
	let index = Math.floor(Math.log(srcsize) / Math.log(1024));
	let sizes = srcsize / Math.pow(1024, index);
	return sizes.toFixed(2) + ` ${unitArr[index]}`
}

// file type filter
export function fileType(type) {
  let typeTxt = type.toLowerCase();
  if (typeTxt === '.pptx' || typeTxt === '.ppt') {
    return require('../assets/file/ppt.png');
  } else if (typeTxt === '.pdf') {
    return require('../assets/file/pdf.png');
  } else if (typeTxt === '.jpg' || typeTxt === '.jpeg' || typeTxt === '.png') {
    return require('../assets/file/jpg.png');
  } else if (typeTxt === '.xlsx' || typeTxt === '.csv') {
    return require('../assets/file/excel.png');
  } else if (typeTxt === '.doc' || typeTxt === '.docx') {
    return require('../assets/file/word.png');
  } else if (typeTxt === '.txt') {
    return require('../assets/file/txt.png');
  } else if (typeTxt === '.mp3') {
    return require('../assets/file/audio.png');
  } else if (typeTxt === '.mp4') {
    return require('../assets/file/video.png');
  } else if (typeTxt === '.zip' || typeTxt === '.rar') {
    return require('../assets/file/zip.png');
  } else if (typeTxt === '.folder') {
    return require('../assets/file/folder.png');
  } else {
    return require('../assets/file/unknown.png');
      }
}

export default {
  validEmail,
  validCode,
  validPass,
  isAllMoney,
  renderSize,
  fileType
}
