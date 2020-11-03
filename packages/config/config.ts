import {injectable, unmanaged} from 'inversify'

import {Exception} from '@centsideas/common/types'
import {GenericErrors, RpcStatus} from '@centsideas/common/enums'

@injectable()
export class Config {
  constructor(@unmanaged() private parsedConfig: Record<string, any> = {}) {}

  static fromConfig(config: any, secrets: any) {
    const fullConfig = {...config, secrets: {...secrets}}
    const parsedConfig = flattenObject(fullConfig)
    return new Config(parsedConfig)
  }

  get(identifier: string, fallback?: string): string {
    const value = this.getEnv(identifier) || fallback
    if (value === undefined) throw new ConfigValueNotFound(identifier)
    return value
  }

  getNumber(identifier: string, fallback?: number): number {
    return Number(this.get(identifier, fallback?.toString()))
  }

  getArray(identifier: string, fallback?: string[]): string[] {
    const values = []
    let index = 0
    while (!!this.getEnv(`${identifier}.${index}`)) {
      values.push(this.getEnv(`${identifier}.${index}`))
      index += 1
    }

    if (fallback && !values.length) return fallback
    return values
  }

  override(identifier: string, value: string | number) {
    this.parsedConfig[identifier] = value
  }

  get parsed() {
    return this.parsedConfig
  }

  get parsedOnlySecrets() {
    const secrets = {}
    const all = this.parsed
    for (const key in all) {
      if (key.startsWith('secrets.')) (secrets as any)[key] = all[key]
    }
    return secrets
  }

  get parsedConfigNoSecrets() {
    const config = {}
    const all = this.parsed
    for (const key in all) {
      if (!key.startsWith('secrets.')) (config as any)[key] = all[key]
    }
    return config
  }

  private getEnv(identifier: string) {
    return this.parsedConfig[identifier] || process.env[identifier]
  }
}

function flattenObject(object: any) {
  const toReturn = {}
  for (const i in object) {
    if (!object.hasOwnProperty(i)) continue
    if (typeof object[i] === 'object' && object[i] !== null) {
      const flatObject = flattenObject(object[i])
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue
        ;(toReturn as any)[i + '.' + x] = (flatObject as any)[x]
      }
    } else {
      ;(toReturn as any)[i] = object[i]
    }
  }
  return toReturn
}

export class ConfigValueNotFound extends Exception {
  name = GenericErrors.ConfigValueNotFound
  code = RpcStatus.INTERNAL

  constructor(identifier: string) {
    super(`No value for config ${identifier} found.`, {identifier})
  }
}
