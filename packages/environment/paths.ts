import * as path from 'path';

const rootDir = path.join(__dirname, '../../');
const packagesDir = path.join(rootDir, 'packages');
const servicesDir = path.join(rootDir, 'services');
export const dotenvFilePath = path.join(rootDir, '.env');

const kubernetesDir = path.join(packagesDir, 'kubernetes');
const mainClientDir = path.join(servicesDir, 'client');
const adminClientDir = path.join(servicesDir, 'admin-client');

export const templatePaths = {
  k8sConfig: path.join(kubernetesDir, 'config.template.yaml'),
  k8sSecret: path.join(kubernetesDir, 'secret.template.yaml'),
  mainClient: path.join(mainClientDir, 'environment', 'environment.template.ts'),
  adminClient: path.join(adminClientDir, 'environment', 'environment.template.ts'),
};

export const genPaths = {
  k8sConfig: path.join(kubernetesDir, 'config.yaml'),
  k8sSecret: path.join(kubernetesDir, 'secret.yaml'),
  mainClient: path.join(mainClientDir, 'environment', 'environment.ts'),
  adminClient: path.join(adminClientDir, 'environment', 'environment.ts'),
};
