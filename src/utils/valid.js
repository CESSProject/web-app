export function validEmail(val) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(val)
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
  let videoList = ['.avi', '.wmv', '.mpeg', '.mp4', '.mov', '.mkv', '.flv', '.f4v', '.m4v', '.rmvb', '.rm', '.3gp', '.dat', '.ts', '.mts', '.vob']
  if (typeTxt === '.pptx' || typeTxt === '.ppt') {
    return require('../assets/files/ppt.png');
  } else if (typeTxt === '.pdf') {
    return require('../assets/files/pdf.png');
  } else if (typeTxt === '.xlsx' || typeTxt === '.csv'|| typeTxt === '.xls') {
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


export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return timeStr;
}
export function similarValue(key) {
  let similarValue
  if (15 < key && key < 25) {
    similarValue = 48 + (16 - key) * 5 + '%'
  } else {
    return '0%'
  }
  return similarValue;
}

export default {
  validEmail,
  renderSize,
  fileType,
  similarValue,
  parseTime
}