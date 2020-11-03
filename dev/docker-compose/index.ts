import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({path: path.join(__dirname, '../../packages/config/', 'docker-compose.env')})

import generate from './generate-file'
import generateDefaultService, {defaultVolumes, tsNodeDevCommand} from './docker-compse.defaults'
import {DockerComposeService} from './docker-compose.service'

const zookeeper = new DockerComposeService('zookeeper', {
  image: 'zookeeper',
  ports: [{internal: 2181, external: 2181}],
  environment: {ZOO_LOG4J_PROP: 'WARN'},
})
const kafka = new DockerComposeService('kafka', {
  image: 'confluentinc/cp-kafka',
  ports: [{internal: 9092, external: 9092}],
  environment: {
    KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181',
    KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka:9092',
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: '1',
  },
  dependsOn: ['zookeeper'],
})
const kowl = new DockerComposeService('kowl', {
  image: 'quay.io/cloudhut/kowl:v1.1.0',
  ports: [{internal: 8080, external: 8080}],
  volumes: [{from: './dev/docker-compose/kowl.config.yaml', to: '/etc/kowl/config.yaml'}],
  entrypoint: './kowl --config.filepath=/etc/kowl/config.yaml',
  dependsOn: ['kafka'],
  restart: 'on-failure',
})

const mongoEventStore = new DockerComposeService('mongo-db', {
  image: 'mongo:4',
  ports: [{internal: 27017, external: 27017}],
  environment: {
    MONGO_INITDB_ROOT_USERNAME: 'admin',
    MONGO_INITDB_ROOT_PASSWORD: process.env['secrets.eventStore.password']!,
  },
})

const gateway = generateDefaultService('gateway', {ports: [{internal: 3000, external: 3000}]})
const auth = generateDefaultService('auth', {
  dependsOn: ['kafka'],
  entrypoint: tsNodeDevCommand('services/auth/write'),
  volumes: [...defaultVolumes, {from: './services/auth', to: '/services/auth'}],
})
const user = generateDefaultService('user', {
  dependsOn: ['kafka'],
  entrypoint: tsNodeDevCommand('services/user/write'),
  volumes: [...defaultVolumes, {from: './services/user', to: '/services/user'}],
})
const userRead = generateDefaultService('user-read', {
  dependsOn: ['kafka'],
  entrypoint: tsNodeDevCommand('services/user/read'),
  volumes: [...defaultVolumes, {from: './services/user', to: '/services/user'}],
})

generate([zookeeper, kafka, kowl, mongoEventStore, gateway, auth, user, userRead])
