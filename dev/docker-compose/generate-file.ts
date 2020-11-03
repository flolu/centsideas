import * as path from 'path'
import * as fs from 'fs'

import {DockerComposeService} from './docker-compose.service'

export default async function generateFile(services: DockerComposeService[]) {
  const compose = {
    version: '3',
    services: Object(),
  }
  for (const svc of services) {
    compose.services[svc.name] = svc.toObject()
  }
  const content = JSON.stringify(compose, null, 2)
  const filepath = path.join('docker-compose.json')
  await fs.promises.writeFile(filepath, content)
}
