import 'reflect-metadata'

import {Config, ConfigValueNotFound} from './config'

describe('config', () => {
  const sampleConfig = {
    env: 'duck',
    port: 2904,
    api: {
      url: 'api.centsideas.com',
    },
    brokers: ['broker:1111', 'broker:2222', 'broker:3333'],
  }

  const sampleSecrets = {
    tokens: {
      access: 'secret',
    },
    privateKey: 'blank',
  }

  it('can be instantiated from config data', () => {
    const config = Config.fromConfig(sampleConfig, sampleSecrets)
    expect(config.parsed).toEqual({
      env: sampleConfig.env,
      port: sampleConfig.port,
      'api.url': sampleConfig.api.url,
      'brokers.0': sampleConfig.brokers[0],
      'brokers.1': sampleConfig.brokers[1],
      'brokers.2': sampleConfig.brokers[2],
      'secrets.tokens.access': sampleSecrets.tokens.access,
      'secrets.privateKey': sampleSecrets.privateKey,
    })
  })

  it('gets string values', () => {
    const config = Config.fromConfig(sampleConfig, sampleSecrets)
    expect(config.get('env')).toEqual(sampleConfig.env)
    expect(config.get('api.url')).toEqual(sampleConfig.api.url)
    expect(config.get('secrets.tokens.access')).toEqual(sampleSecrets.tokens.access)
    expect(config.get('not defined', 'fallback')).toEqual('fallback')
  })

  it('gets number values', () => {
    const config = Config.fromConfig(sampleConfig, sampleSecrets)
    expect(config.getNumber('port')).toEqual(sampleConfig.port)
    expect(config.getNumber('not defined', 1234)).toEqual(1234)
  })

  it('gets array values', () => {
    const config = Config.fromConfig(sampleConfig, sampleSecrets)
    expect(config.getArray('brokers')).toEqual(sampleConfig.brokers)
    expect(config.getArray('not defined', ['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('reads environment variables', () => {
    const config = new Config()
    const value1 = 'hello'
    const value2 = 1234

    process.env.sampleValue1 = value1
    process.env.sampleValue2 = value2.toString()
    process.env['sampleArray.0'] = 'a'
    process.env['sampleArray.1'] = 'b'

    expect(config.get('sampleValue1')).toEqual(value1)
    expect(config.getNumber('sampleValue2')).toEqual(value2)
    expect(config.getArray('sampleArray')).toEqual(['a', 'b'])
  })

  it('throws when value was not found and no fallback is provided', () => {
    const config = new Config()
    expect(() => config.get('not defined')).toThrow(new ConfigValueNotFound('not defined'))
  })

  it('overrides values', () => {
    const config = Config.fromConfig(sampleConfig, sampleSecrets)
    const overwrittenValue = 'api.centsideas.de'
    config.override('api.url', overwrittenValue)
    expect(config.parsed['api.url']).toEqual(overwrittenValue)
  })
})
