import network from '@/utils/network'
// import { apiUrl } from '@/utils/url'
// import store from '../store'

export function addFileData(data) {
  return network({
    url: '/xbaasstudio/upload/upload.Action',
    method: 'post',
    data
  });
}


export function fileUploadList(params) {
  return network({
    url: '/xbaasstudio/upload/listUpload.Action',
    method: 'get',
    params
  });
}


export function deleteFileUpload(fileId) {
  return network({
    url: '/xbaasstudio/upload/upload.Action',
    method: 'delete',
    data: {
      fileId
    }
  });
}


export function filesList(params) {
  return network({
    url: '/xbaasstudio/files/listFiles.Action',
    method: 'get',
    params
  });
}


export function deleteFiles(fileId) {
  return network({
    url: '/xbaasstudio/files/files.Action',
    method: 'delete',
    data: {
      fileId
    }
  });
}


export function modifyFile(data) {
  return network({
    url: '/xbaasstudio/files/files.Action',
    method: 'put',
    data
  });
}


export function getShareCode(params) {
  return network({
    url: '/xbaasstudio/share/shareCode.Action',
    method: 'get',
    params
  });
}


export function decryptShareCode(shareCode) {
  return network({
    url: '/xbaasstudio/share/decryptCode.Action',
    method: 'get',
    params: {
      shareCode
    }
  });
}


export function localFileDownload(hash) {
  return network({
    url: '/xbaasstudio/file/cat/' + hash,
    method: 'get',
    responseType: 'blob'
  });
}


export function queryFileNeedPay(fileId) {
  return network({
    url: `/xbaasstudio/files/queryFileNeedPay.Action?fileId=` + fileId,
    method: 'get'
  });
}


export function fileDownload(data) {
  return network({
    url: '/xbaasstudio/download/download.Action',
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


export function queryFilesList(params) {
  return network({
    url: '/xbaasstudio/files/queryFiles.Action',
    method: 'get',
    params
  });
}


export function getNewsList(data) {
  return network({
    url: `/backstage/system/article/page`,
    method: "post",
    data
  });
}


export function getNewsDetail(params) {
  return network({
    url: `/backstage/system/article/get`,
    method: "get",
    params
  })
}


export function storageFileSize() {
  return network({
    url: `/xbaasstudio/files/queryTotalSize.Action`,
    method: "get"
  })
}

export function getGlobalNodeData(pagenum) {
  return network({
    url: `/peer/list?pagesize=10&pagenum=` + pagenum,
    method: "get"
  })
}


export function getFileInfo(fileId) {
  return network({
    url: `/xbaasstudio/files/queryFile.Action?fileId=` + fileId,
    method: "get"
  })
}


export function createNewFolder(data) {
  return network({
    url: '/xbaasstudio/folder',
    method: "post",
    data
  })
}

export function deleteFolder(id) {
  return network({
    url: '/xbaasstudio/folder',
    method: 'delete',
    data: {
      id
    }
  });
}

export function modifyFolder(data) {
  return network({
    url: '/xbaasstudio/folder',
    method: 'put',
    data
  });
}


export function getFolderList(id) {
  return network({
    url: `/xbaasstudio/folder?parentId=` + id,
    method: "get"
  })
}


export function uploadList(params) {
  return network({
    url: '/xbaasstudio/upload/listUpload.Action',
    method: 'get',
    params
  });
}


export function deleteUploadRecord(uploadId) {
  return network({
    url: '/xbaasstudio/upload/upload.Action',
    method: 'delete',
    data: {
      uploadId
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
