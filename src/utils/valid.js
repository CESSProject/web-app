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
  let audioList = ['.cd', '.wave', '.aiff', '.mpeg', '.mpeg-4', '.mp3', '.midi', '.wma', '.realaudio', '.vqf', '.offvorbis', '.amr', '.ape', '.flac', '.aac'];
  let imageList = ['.jpg', '.jpeg', '.png', '.gif', '.psd', '.psb', '.ai', '.svg'];
  let videoList = ['.avi', '.wmv', 'mpeg', 'mp4', 'mov', 'mkv', 'flv', 'f4v', 'm4v', 'rmvb', 'rm', '3gp', 'dat', 'ts', 'mts', 'vob']
  if (typeTxt === '.pptx' || typeTxt === '.ppt') {
    return require('../assets/files/ppt.png');
  } else if (typeTxt === '.pdf') {
    return require('../assets/files/pdf.png');
  } else if (typeTxt === '.xlsx' || typeTxt === '.csv') {
    return require('../assets/files/xls.png');
  } else if (typeTxt === '.doc' || typeTxt === '.docx') {
    return require('../assets/files/doc.png');
  } else if (typeTxt === '.txt') {
    return require('../assets/files/txt.png');
  } else if (imageList.indexOf(typeTxt) != -1) {
    return require('../assets/files/image.png');
  } else if (videoList.indexOf(typeTxt) != -1) {
    return require('../assets/files/video.png');
  } else if (audioList.indexOf(typeTxt) != -1) {
    return require('../assets/files/mp3.png');
  } else if (typeTxt === '.zip') {
    return require('../assets/files/zip.png');
  } else {
    return require('../assets/files/other.png');
  }
}

export function similarValue(key) {
  let similarValue
  if (key > 15) {
    similarValue = 48 + (key - 16) * 5 + '%'
  }else {
    return 'Aligning'
  }
  return similarValue;
}

export default {
  validEmail,
  validCode,
  validPass,
  isAllMoney,
  renderSize,
  fileType
}