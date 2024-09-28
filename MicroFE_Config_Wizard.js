// eslint-disable-file
import readline from 'node:readline'

import { promises as fsPromises } from 'fs'
import path from 'path'

const PP_FOLDER_PATH = '../partner-portal'

// #region Helper Functions
const rl = readline.createInterface({
  // eslint-disable-next-line no-undef
  input: process.stdin,
  // eslint-disable-next-line no-undef
  output: process.stdout,
})

function askQuestion(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`\n${question}`, (answer) => {
      resolve(answer.trim())
    })
    if (defaultValue) rl.write(defaultValue)
  })
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function replaceTextInFile(filePath, replacements) {
  try {
    // Read the content of the file
    let data = await fsPromises.readFile(filePath, 'utf8')

    // Apply replacements sequentially
    let modifiedContent = data
    replacements.forEach(({ pattern, replacement }) => {
      modifiedContent = modifiedContent.replace(pattern, replacement)
    })

    // Write the modified content back to the file
    await fsPromises.writeFile(filePath, modifiedContent, 'utf8')
    console.log(`${filePath}:\t Text replaced successfully.`)
  } catch (error) {
    console.error('Error:', error)
  }
}

async function insertLineAfterMatch(filePath, searchText, lineToInsert) {
  try {
    const data = await fsPromises.readFile(filePath, 'utf8')

    const index = data.indexOf(searchText)
    if (index === -1) {
      console.log('Search text not found in the file.')
      return
    }

    const positionToInsert = index + searchText.length
    const newData = data.slice(0, positionToInsert) + '\n' + lineToInsert + data.slice(positionToInsert)

    await fsPromises.writeFile(filePath, newData)
    console.log('Line inserted successfully.')
  } catch (err) {
    console.error('Error:', err)
  }
}

async function copyFile(sourceFilePath, destinationDirectory, newFileName) {
  try {
    // Read the content of the source file
    const data = await fsPromises.readFile(sourceFilePath)

    // Construct the destination file path
    const destinationFilePath = path.join(destinationDirectory, newFileName)

    // Write the content to the destination file
    await fsPromises.writeFile(destinationFilePath, data)

    console.log(`File copied successfully to ${destinationFilePath}`)
  } catch (error) {
    console.error('Error copying file:', error)
  }
}

async function copyFileWithNewName(originalFilePath, newFileName) {
  try {
    // Read the content of the original file
    const data = await fsPromises.readFile(originalFilePath, 'utf8')

    // Create the new file path
    const directory = path.dirname(originalFilePath)
    const newFilePath = path.join(directory, newFileName)

    // Write the content to the new file
    await fsPromises.writeFile(newFilePath, data, 'utf8')
    console.log(`${newFileName}:\t File copied successfully.`)
  } catch (error) {
    console.error('Error:', error)
  }
}
// #endregion

// #region Main Functions
async function ExecuteOnMicroFEProject({ applicationTitle, repoName, componentName, publicURL, username, password, hubCoId }) {
  await replaceTextInFile('index.html', [{ pattern: /<title>[\w\s]+<\/title>/g, replacement: `<title>${applicationTitle}</title>` }])
  await replaceTextInFile('package.json', [{ pattern: /"name": "[\w\s-]+",/g, replacement: `"name": "${repoName}",` }])
  await replaceTextInFile('vite.config.ts', [
    { pattern: /name: '[\w-]+',/g, replacement: `name: '${repoName}',` },
    { pattern: /'\.\/[\w/\d]+': '\.\/src\/App_Export',/g, replacement: `'./${componentName}': './src/App_Export',` },
  ])
  await replaceTextInFile('.env.example', [{ pattern: /VITE_PUBLIC_URL=\/[\w]+/g, replacement: `VITE_PUBLIC_URL=${publicURL}` }])
  await copyFileWithNewName('.env.example', '.env')
  await replaceTextInFile('.env', [
    { pattern: /VITE_INTERNAL_LOGIN_USERNAME=[\S]+/g, replacement: `VITE_INTERNAL_LOGIN_USERNAME=${username}` },
    { pattern: /VITE_INTERNAL_LOGIN_PASSWORD=[\S]+/g, replacement: `VITE_INTERNAL_LOGIN_PASSWORD=${password}` },
    { pattern: /VITE_INTERNAL_LOGIN_HUBCO_ID=[\S]+/g, replacement: `VITE_INTERNAL_LOGIN_HUBCO_ID=${hubCoId}` },
  ])
}

async function ExecuteOnPartnerPortal({ applicationTitle, componentName, publicURL }) {
  const env_remoteEntryKey = `VITE_${applicationTitle.replace(/\s+/g, '_').toUpperCase()}_REMOTEENTRY_URL`
  const env_remoteEntryValue = `http://localhost:3001${publicURL}/dist/assets/remoteEntry.js`
  const remoteComponentPath = `remote${componentName}/${componentName}`
  const env_remoteComponentName = `remote${componentName}`
  const env_d_ts_ComponentType = `type ${componentName}Type = React.LazyExoticComponent<React.ComponentType<any>>`
  const env_d_ts_DeclareModule = `
  declare module '${remoteComponentPath}' {
      const ${env_remoteComponentName}: ${componentName}Type
      export default ${env_remoteComponentName}
  }`
  const route_key = applicationTitle.replace(/\s+/g, '_').toUpperCase()
  const route_value = applicationTitle.replace(/\s+/g, '').toLowerCase()
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/.env.example`,
    'VITE_CONFIG_STUDIO_REMOTEENTRY_URL=CONFIG_STUDIO_REMOTEENTRY_URL_PLACEHOLDER',
    `${env_remoteEntryKey}=${env_remoteEntryKey}_PLACEHOLDER`,
  )
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/.env`,
    'VITE_CONFIG_STUDIO_REMOTEENTRY_URL=https://portal-oreo.cloud.conexiom.com/a/cstudio/assets/remoteEntry.js',
    `${env_remoteEntryKey}=${env_remoteEntryValue}`,
  )
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/env.d.ts`,
    'type ConfigStudioUIType = React.LazyExoticComponent<React.ComponentType<any>>',
    `${env_d_ts_ComponentType}`,
  )
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/env.d.ts`,
    `type SettingsUIType = React.LazyExoticComponent<React.ComponentType<any>>`,
    `${env_d_ts_DeclareModule}`,
  )
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/vite.config.ts`,
    'remoteConfigStudio: env.VITE_CONFIG_STUDIO_REMOTEENTRY_URL,',
    `${env_remoteComponentName}: env.${env_remoteEntryKey},`,
  )
  await insertLineAfterMatch(`${PP_FOLDER_PATH}\/src\/constants.ts`, 'export enum ProductName {', `${componentName} = '${applicationTitle}',`)
  await insertLineAfterMatch(`${PP_FOLDER_PATH}\/src\/enums.ts`, 'export enum Routes {', `${route_key} = '\/${route_value}',`)
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/src\/enums.ts`,
    'export const V2_ROUTES = {',
    `${route_key} :{
      path: '/:hubCoId' + Routes.${route_key},
      url: (hubCoId: string) => '/' + hubCoId + Routes.${route_key},
  },`,
  )
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/src\/Components\/Home\/Home.tsx`,
    `import ConfigStudioUI from '../../extapp/ConfigStudioUI'`,
    `import ${componentName} from '../../extapp/${componentName}'`,
  )
  await insertLineAfterMatch(
    `${PP_FOLDER_PATH}\/src\/Components\/Home\/Home.tsx`,
    `{/* V2 Routes with HubCoID and SpokeCoID */}`,
    `<ProtectedRoute path={V2_ROUTES.${route_key}.path} component={${componentName}} />`,
  )
  await copyFile('./MicroFE_Config_Wizard/Template_PartnerPortal_UI.txt', `${PP_FOLDER_PATH}\/src\/extapp`, `${componentName}.tsx`)
  await replaceTextInFile(`${PP_FOLDER_PATH}\/src\/extapp\/${componentName}.tsx`, [
    { pattern: /TEMPLATE_REMOTE_ENTRY_URL/g, replacement: remoteComponentPath },
    { pattern: /TEMPLATE_PP_COMPONENT_NAME/g, replacement: componentName },
    { pattern: /TEMPLATE_PRODUCTNAME_KEY/g, replacement: componentName },
    { pattern: /TEMPLATE_ROUTE_KEY/g, replacement: route_key },
  ])
}
// #endregion

async function configWizard() {
  console.log('\nWelcome to the Micro Frontend Template configuration wizard\n')

  const applyToPP5 = await askQuestion(
    `Do you want to connect this Micro Frontend to Partner Portal? (yes/no)
    This will require partner-portal repo as the adjacent repo.\n`,
    'yes',
  )

  const applicationTitle = await askQuestion(`1. application title:
    The title will be visible to users on their browsers. The default value is Micro Frontend Template.
    example: Express, Configuration Studio, Partner Portal Settings\n`)

  const repoName = await askQuestion(
    `2. Enter repository name:
    The name will be added to package.json and vite.config.ts file.
    We suggest the following name. (press enter to accept)\n`,
    applicationTitle.replace(/\s+/g, '-').toLowerCase(),
  )

  const componentName = await askQuestion(
    `3. Enter exported React component name:
    The name will be added to vite.config.ts file and Partner Portal will use this name as component name.
    We suggest the following name. (press enter to accept)\n`,
    capitalizeFirstLetter(applicationTitle.replace(/\s+/g, '')),
  )

  const publicURL = await askQuestion(
    `4. Enter application root route:
    The name will be added to .env and .env.example files. The name should always start with Vite. For example: ViteConfigStudio, ViteElements, ViteSettings.
    We suggest the following name. (press enter to accept)\n`,
    '/Vite' + capitalizeFirstLetter(applicationTitle.replace(/\s+/g, '')),
  )

  console.log('\n5. Setup Local Envrionment')

  const username = await askQuestion(`5.1. Partner Portal Username:\n`, 'lhsieh@dev.ecmarket.com')
  const password = await askQuestion(`5.2. Partner Portal Password:\n`)
  const hubCoId = await askQuestion(`5.3. HubCo Id:\n`, '630b9a62-f7f7-4c06-b5be-b127ae1fe16e')

  console.log('Review your Micro Frontend Configurations: \n')
  console.log('* Connect to Partner Portal:', applyToPP5)
  console.log('* Application Title:', applicationTitle)
  console.log('* Repository Name:', repoName)
  console.log('* Exported Component Name:', componentName)
  console.log('* Application Root Route:', publicURL)
  console.log('* Local Environment')
  console.log('*  - PP Username:', username)
  console.log('*  - PP Password:', '******')
  console.log('*  - HubCo Id:', hubCoId)

  const confirm = await askQuestion('Are you sure you want to continue? (yes/no)\n', 'yes')

  console.log('\nExecuting...\n')

  if (confirm !== 'yes') {
    console.log('Configuration wizard cancelled.')
  } else {
    await ExecuteOnMicroFEProject({ applicationTitle, componentName, hubCoId, password, publicURL, repoName, username })
    console.log('\n**** Configuration on Micro-Fronent Porject completed successfully.\n')
    if (applyToPP5 === 'yes') {
      await ExecuteOnPartnerPortal({ applicationTitle, componentName, publicURL })
      console.log('\n**** Configuration on PartnerPortal completed successfully.\n')
    }
    console.log('\n**** Configuration Wizard completed successfully.\n')
  }

  rl.close()
}

configWizard()
