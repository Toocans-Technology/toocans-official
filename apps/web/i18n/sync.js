const crowdin = require('@crowdin/crowdin-api-client')
const fs = require('fs')
const path = require('path')
const https = require('https')
const AdmZip = require('adm-zip')

// TODO: Crowdin 项目配置
const CROWDIN_PROJECT_ID = ''
const CROWDIN_API_KEY = ''
const SOURCE_LANGUAGE = 'zh-CN'
const TARGET_LANGUAGES = ['en-US', 'eo']

// 添加 Crowdin 语言代码到目标语言代码的映射
const CROWDIN_TO_TARGET_LANGUAGE_MAP = {
  en: 'en-US',
  eo: 'eo',
}

// 初始化 Crowdin 客户端
const { uploadStorageApi, sourceFilesApi, translationsApi } = new crowdin.default({
  token: CROWDIN_API_KEY,
})

// 上传源文件
async function uploadSourceFiles() {
  const sourceDir = path.join(__dirname, `/locales/${SOURCE_LANGUAGE}`)
  const files = fs.readdirSync(sourceDir)
  const projectFiles = await sourceFilesApi.listProjectFiles(CROWDIN_PROJECT_ID, {
    limit: 500,
  })

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(sourceDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')

      try {
        // 上传到 Crowdin 存储
        const storageFile = await uploadStorageApi.addStorage(file, fileContent)

        // 先尝试创建新文件
        try {
          await sourceFilesApi.createFile(CROWDIN_PROJECT_ID, {
            storageId: storageFile.data.id,
            name: file,
            type: 'json',
          })
          console.log(`Created new file: ${file}`)
        } catch (_) {
          // 如果文件已存在（创建失败），则尝试更新
          const existingFile = projectFiles.data.find((f) => f.data.name === file)
          if (existingFile) {
            await sourceFilesApi.updateOrRestoreFile(CROWDIN_PROJECT_ID, existingFile.data.id, {
              storageId: storageFile.data.id,
            })
            console.log(`Updated existing file: ${file}`)
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error.message)
        if (error.error) {
          console.error('Detailed error:', JSON.stringify(error.error, null, 2))
        }
      }
    }),
  )
}

// TODO: 下载翻译文件
async function downloadTranslations() {
  try {
    // 构建整个项目的翻译
    const build = await translationsApi.buildProject(CROWDIN_PROJECT_ID)

    // 等待构建完成
    let status = build.data.status
    while (status === 'inProgress') {
      await new Promise((resolve) => setTimeout(resolve, 5000)) // 等待5秒
      const buildStatus = await translationsApi.checkBuildStatus(CROWDIN_PROJECT_ID, build.data.id)
      status = buildStatus.data.status
    }

    if (status !== 'finished') {
      console.error(`Project build failed: ${status}`)
      return
    }

    // 下载构建的ZIP文件
    const download = await translationsApi.downloadTranslations(CROWDIN_PROJECT_ID, build.data.id)
    const zipFilePath = path.join(__dirname, 'translations.zip')

    await new Promise((resolve, reject) => {
      https
        .get(download.data.url, (response) => {
          const file = fs.createWriteStream(zipFilePath)
          response.pipe(file)
          file.on('finish', () => {
            file.close(resolve)
          })
        })
        .on('error', reject)
    })

    // 解压ZIP文件
    const zip = new AdmZip(zipFilePath)
    const zipEntries = zip.getEntries()

    for (const entry of zipEntries) {
      const entryPath = entry.entryName.split('/')
      if (entryPath.length < 2) continue

      const crowdinLang = entryPath[0]
      const targetLang = CROWDIN_TO_TARGET_LANGUAGE_MAP[crowdinLang] || crowdinLang

      if (!TARGET_LANGUAGES.includes(targetLang)) continue

      const fileName = entryPath[entryPath.length - 1]
      const targetDir = path.join(__dirname, `locales/${targetLang}`)

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      zip.extractEntryTo(entry, targetDir, false, true)
      console.log(`Extracted ${fileName} to ${targetLang} directory`)
    }

    // 删除下载的ZIP文件
    fs.unlinkSync(zipFilePath)
    console.log('Translations download and extraction completed')
  } catch (error) {
    console.error('Error downloading translations:', error.message)
  }
}

// 执行同步
async function sync() {
  try {
    // 获取命令行参数
    const args = process.argv.slice(2)
    const onlyDownload = args.includes('--only-download')

    if (onlyDownload) {
      await downloadTranslations()
      console.log('Download completed successfully')
    } else {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      if (!process.env.JENKINS_HOME || process.env.BRANCH !== 'dev') {
        console.error('Error: sync can only be executed in a Jenkins environment.')
        return
      }
      await Promise.all([uploadSourceFiles(), downloadTranslations()])
      console.log('Full sync completed successfully')
    }
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

sync()
