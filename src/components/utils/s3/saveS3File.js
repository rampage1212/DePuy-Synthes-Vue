import { getFile } from '@/api/httpClient.js'
import { saveAs } from 'file-saver'

export default async function saveS3File({
  s3Directory,
  s3FileName,
  fileName,
}) {
  try {
    let s3File = await getFile(s3FileName, s3Directory)

    if (typeof s3File === 'string') {
      const s3Response = await fetch(s3File)
      if (s3Response.status !== 200)
        throw { status: s3Response.status, link: s3File }
      s3File = await s3Response.blob()
    }

    saveAs(s3File, fileName)
  } catch (err) {
    if (err.status === 404) {
      throw 404
    } else {
      throw err
    }
  }
}

export function retrySaveS3File({
  s3Directory,
  s3FileName,
  fileName,
  isDownloading,
}) {
  isDownloading.value = true
  let retryCount = 0

  setTimeout(async () => {
    try {
      await saveS3File({
        s3Directory,
        s3FileName,
        fileName,
      })
    } catch (error) {
      if ((error == 404 || error == 504) && retryCount < 20) {
        retryCount++
        return retrySaveS3File({
          s3Directory,
          s3FileName,
          fileName,
          isDownloading,
        })
      }
    }
    isDownloading.value = false
  }, 10000)
}
