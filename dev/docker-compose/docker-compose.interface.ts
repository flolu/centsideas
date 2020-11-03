export interface ServiceOptions {
  image: string
  command?: string
  workingDir?: string
  volumes?: VolumeMapping[]
  ports?: PortMapping[]
  envFile?: string
  environment?: Record<string, string>
  dependsOn?: string[]
  entrypoint?: string
  restart?: string
}

export interface SerializedServiceOptions {
  image: string
  container_name: string
  command?: string
  working_dir?: string
  volumes?: string[]
  ports?: string[]
  env_file?: string
  environment?: Record<string, string>
  depends_on?: string[]
  entrypoint?: string
  restart?: string
}

export interface VolumeMapping {
  from: string
  to: string
}

export interface PortMapping {
  internal: number
  external: number
}
