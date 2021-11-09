import network from '@/utils/network'
// import { apiUrl } from '@/utils/url'
// import store from '../store'

/**
 * 登录
 * @param {
 *    user: string,
 *    password: string
 * }
 */
export function login(data) {
  return network({
    url: '/opuser/loginPassword',
    method: 'post',
    data
  });
}

/**
 * 获取验证码
 * @param {
 *    target: string,
 *    country: string (默认86) 非必传
 * }
 */
export function getCode(params) {
  return network({
    url: '/opuser/getCode',
    method: 'get',
    params
  });
}

/**
 * 校验验证码
 * @param {
 *    oncePassword: string
 * }
 */
export function validateCode(oncePassword) {
  return network({
    url: '/opuser/validateCode',
    method: 'get',
    params: {
      oncePassword
    }
  });
}

/**
 * 获取基本用户信息
 * @param {
 *     ids: Array
 * }
 */
export function getUserInfo(data) {
  return network({
    url: '/opuser/publicUsersInfo',
    method: 'post',
    data
  })
}

// 上传本地文件
export function addFileData(data) {
  return network({
    url: '/xbaasstudio/upload/upload.Action',
    method: 'post',
    data
  });
}

// 获取上传文件列表
export function fileUploadList(params) {
  return network({
    url: '/xbaasstudio/upload/listUpload.Action',
    method: 'get',
    params
  });
}

// 删除上传文件
export function deleteFileUpload(fileId) {
  return network({
    url: '/xbaasstudio/upload/upload.Action',
    method: 'delete',
    data: {
      fileId
    }
  });
}

// 获取文件列表
export function filesList(params) {
  return network({
    url: '/xbaasstudio/files/listFiles.Action',
    method: 'get',
    params
  });
}

// 删除文件
export function deleteFiles(fileId) {
  return network({
    url: '/xbaasstudio/files/files.Action',
    method: 'delete',
    data: {
      fileId
    }
  });
}

// 修改文件
export function modifyFile(data) {
  return network({
    url: '/xbaasstudio/files/files.Action',
    method: 'put',
    data
  });
}

// 获取分享码
export function getShareCode(params) {
  return network({
    url: '/xbaasstudio/share/shareCode.Action',
    method: 'get',
    params
  });
}

// 解析分享码
export function decryptShareCode(shareCode) {
  return network({
    url: '/xbaasstudio/share/decryptCode.Action',
    method: 'get',
    params: {
      shareCode
    }
  });
}

// 本地文件下载
export function localFileDownload(hash) {
  return network({
    url: '/xbaasstudio/file/cat/' + hash,
    method: 'get',
    responseType: 'blob'
  });
}

// 查询文件是否需要支付
export function queryFileNeedPay(fileId) {
  return network({
    url: `/xbaasstudio/files/queryFileNeedPay.Action?fileId=` + fileId,
    method: 'get'
  });
}

// 开始下载文件
export function fileDownload(data) {
  return network({
    url: '/xbaasstudio/download/download.Action',
    method: 'post',
    data
  });
}

// 下载文件列表
export function downloadList(params) {
  return network({
    url: '/xbaasstudio/download/listDownload.Action',
    method: 'get',
    params
  });
}

// 修改下载进度
export function downloadProgress(data) {
  return network({
    url: '/xbaasstudio/download/download.Action',
    method: 'put',
    data
  });
}

// 删除下载文件
export function deleteDownload(downloadId) {
  return network({
    url: '/xbaasstudio/download/download.Action',
    method: 'delete',
    data: {
      downloadId
    }
  });
}

// 全局搜索文件列表
export function queryFilesList(params) {
  return network({
    url: '/xbaasstudio/files/queryFiles.Action',
    method: 'get',
    params
  });
}

// 查询新闻列表
export function getNewsList(data) {
  return network({
    url: `/backstage/system/article/page`,
    method: "post",
    data
  });
}

// 获取新闻详情
export function getNewsDetail(params) {
  return network({
    url: `/backstage/system/article/get`,
    method: "get",
    params
  })
}

// 查询账号存储文件大小
export function storageFileSize() {
  return network({
    url: `/xbaasstudio/files/queryTotalSize.Action`,
    method: "get"
  })
}

// 获取全球节点数据

export function getGlobalNodeData(pagenum) {
  return network({
    url: `/peer/list?pagesize=10&pagenum=` + pagenum,
    method: "get"
  })
}

//  查询文件信息
export function getFileInfo(fileId) {
  return network({
    url: `/xbaasstudio/files/queryFile.Action?fileId=` + fileId,
    method: "get"
  })
}

// 新建文件夹
export function createNewFolder(data) {
  return network({
    url: '/xbaasstudio/folder',
    method: "post",
    data
  })
}
// 删除文件夹
export function deleteFolder(id) {
  return network({
    url: '/xbaasstudio/folder',
    method: 'delete',
    data: {
      id
    }
  });
}

// 修改文件夹信息
export function modifyFolder(data) {
  return network({
    url: '/xbaasstudio/folder',
    method: 'put',
    data
  });
}

// 查询文件夹列表
export function getFolderList(id) {
  return network({
    url: `/xbaasstudio/folder?parentId=` + id,
    method: "get"
  })
}

// 上传文件列表
export function uploadList(params) {
  return network({
    url: '/xbaasstudio/upload/listUpload.Action',
    method: 'get',
    params
  });
}

// 删除上传文件记录
export function deleteUploadRecord(uploadId) {
  return network({
    url: '/xbaasstudio/upload/upload.Action',
    method: 'delete',
    data: {
      uploadId
    }
  });
}

// 重新上传文件
export function reUploadFile(data) {
  return network({
    url: '/xbaasstudio/upload/reUpload.Action',
    method: "post",
    data
  })
}
