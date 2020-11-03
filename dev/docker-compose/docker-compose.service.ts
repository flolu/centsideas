import {
  ServiceOptions,
  VolumeMapping,
  PortMapping,
  SerializedServiceOptions,
} from './docker-compose.interface'

export class DockerComposeService {
  private readonly servicePrefix = 'centsideas'

  constructor(public readonly name: string, private options: ServiceOptions) {}

  toObject() {
    const obj: SerializedServiceOptions = {
      image: this.options.image,
      container_name: `${this.servicePrefix}_${this.name}`,
      volumes: this.convertVolumes(this.options.volumes || []),
      ports: this.convertPorts(this.options.ports || []),
      environment: this.options.environment || {},
    }
    if (this.options.workingDir) obj.working_dir = this.options.workingDir
    if (this.options.dependsOn) obj.depends_on = this.options.dependsOn
    if (this.options.envFile) obj.env_file = this.options.envFile
    if (this.options.command) obj.command = this.options.command
    if (this.options.entrypoint) obj.entrypoint = this.options.entrypoint
    if (this.options.restart) obj.restart = this.options.restart
    return obj
  }

  private convertVolumes(volumes: VolumeMapping[]) {
    return volumes.map(volume => `${volume.from}:${volume.to}`)
  }

  private convertPorts(ports: PortMapping[]) {
    return ports.map(port => `${port.external}:${port.internal}`)
  }
}
