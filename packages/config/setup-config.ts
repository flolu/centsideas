import 'reflect-metadata'

import {promises as fsPromises} from 'fs'
import * as path from 'path'

import {Exception} from '@centsideas/common/types'
import {RpcStatus} from '@centsideas/common/enums'

import {Config} from './config'
import {dev} from './dev.config'
import {microk8s} from './microk8s.config'
import {prod} from './prod.config'

class InvalidEnvironment extends Exception {
  name = 'invalidEnvironment'
  code = RpcStatus.INTERNAL

  constructor(environment: string) {
    super(`Environment ${environment} doesn't exist.`)
  }
}

async function main() {
  const environment = process.argv.slice(2)[0]
  const environments = ['dev', 'microk8s', 'prod']
  if (!environments.includes(environment)) throw new InvalidEnvironment(environment)

  let data
  if (environment === 'dev') data = dev
  if (environment === 'microk8s') data = microk8s
  if (environment === 'prod') data = prod

  await upsertSecretsFile()
  const secretsFilePath = './secrets.config'
  const {secrets} = await import(secretsFilePath)

  const config = Config.fromConfig(data, secrets)

  let dockerFileData = ''
  for (const key in config.parsed) {
    dockerFileData += key + '=' + config.parsed[key] + '\n'
  }
  const dockerEnvFile = path.join(__dirname, 'docker-compose.env')

  await Promise.all([
    fsPromises.writeFile(dockerEnvFile, dockerFileData),
    createK8sConfig(config.parsedConfigNoSecrets),
    createK8sSecrets(config.parsedOnlySecrets),
  ])
}

async function upsertSecretsFile() {
  const secretsFile = path.join(__dirname, 'secrets.config.ts')
  try {
    await fsPromises.access(secretsFile)
  } catch (error) {
    const exampleSecretsFile = path.join(__dirname, 'secrets.example.ts')
    const exampleSecrets = await fsPromises.readFile(exampleSecretsFile)
    await fsPromises.writeFile(secretsFile, exampleSecrets)
  }
}

async function createK8sSecrets(secrets: any) {
  const templatePath = path.join(__dirname, '../', 'kubernetes', 'secrets.template.yaml')
  const template = await fsPromises.readFile(templatePath)
  let data = ''
  for (const key in secrets) {
    data += `  ${key}: '${secrets[key]}'\n`
  }
  data += '\n'
  const content = template.toString().replace('PLACEHOLDER', data)
  const filePath = path.join(__dirname, '../', 'kubernetes', 'secrets.yaml')
  await fsPromises.writeFile(filePath, content)
}

async function createK8sConfig(config: any) {
  const templatePath = path.join(__dirname, '../', 'kubernetes', 'config.template.yaml')
  const template = await fsPromises.readFile(templatePath)
  let data = ''
  for (const key in config) {
    data += `  ${key}: '${config[key]}'\n`
  }
  data += '\n'
  const content = template.toString().replace('PLACEHOLDER', data)
  const filePath = path.join(__dirname, '../', 'kubernetes', 'config.yaml')
  await fsPromises.writeFile(filePath, content)
}

main()
