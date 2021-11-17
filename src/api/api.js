import network from '@/utils/network'
// import { apiUrl } from '@/utils/url'
// import store from '../store'


export function popularFiles() {
  return network({
    url: 'cess-hacknet/files/popularFiles',
    method: 'get',
  });
}


export function addFileData(data) {
  return network({
    url: '/cess-hacknet/upload/upload.Action',
    method: 'post',
    data
  });
}


export function filesList(params) {
  return network({
    url: '/cess-hacknet/files/listFiles.Action',
    method: 'get',
    params
  });
}

export function getFileInfo(fileId) {
  return network({
    url: `/cess-hacknet/files/queryFile.Action?fileId=` + fileId,
    method: "get"
  })
}

export function deleteFiles(fileId) {
  return network({
    url: '/cess-hacknet/files/files.Action',
    method: 'delete',
    data: {
      fileId
    }
  });
}


export function reUploadFile(data) {
  return network({
    url: '/xbaasstudio/upload/reUpload.Action',
    method: "post",
    data
  })
}


export function getShareCode(params) {
  return network({
    url: '/cess-hacknet/share/shareCode.Action',
    method: 'get',
    params
  });
}


export function decryptShareCode(shareCode) {
  return network({
    url: '/cess-hacknet/share/openShare.Action',
    method: 'get',
    params: {
      shareCode
    }
  });
}


export function queryFileNeedPay(fileId) {
  return network({
    url: `/cess-hacknet/files/queryFileNeedPay.Action?fileId=` + fileId,
    method: 'get'
  });
}


export function fileDownload(data) {
  return network({
    url: '/cess-hacknet/download/download.Action',
    method: 'post',
    data
  });
}

export function downloadList(params) {
  return network({
    url: '/xbaasstudio/download/listDownload.Action',
    method: 'get',
    params
  });
}

export function downloadProgress(data) {
  return network({
    url: '/xbaasstudio/download/download.Action',
    method: 'put',
    data
  });
}


export function deleteDownload(downloadId) {
  return network({
    url: '/xbaasstudio/download/download.Action',
    method: 'delete',
    data: {
      downloadId
    }
  });
}

export function queryFilesList(data) {
  return network({
    url: '/cess-hacknet/files/queryFiles.Action',
    method: 'post',
    data
  });
}



