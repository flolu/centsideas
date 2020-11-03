import {DockerComposeService} from './docker-compose.service'
import {VolumeMapping, ServiceOptions} from './docker-compose.interface'

const nodeImage = 'node:lts-alpine'
export const defaultVolumes: VolumeMapping[] = [
  {from: './package.json', to: '/package.json'},
  {from: './tsconfig.json', to: '/tsconfig.json'},
  {from: './node_modules', to: '/node_modules'},
  {from: './packages', to: '/packages'},
]
const envFilePath = 'packages/config/docker-compose.env'

export const tsNodeDevCommand = (path: string) =>
  `yarn run ts-node-dev -r tsconfig-paths/register ${path}`

export default function generateDefaultService(
  name: string,
  options: Partial<ServiceOptions> = {},
) {
  return new DockerComposeService(`${name}`, {
    image: nodeImage,
    command: tsNodeDevCommand(`services/${name}`),
    volumes: [...defaultVolumes, {from: `./services/${name}`, to: `/services/${name}`}],
    envFile: envFilePath,
    ...options,
  })
}
