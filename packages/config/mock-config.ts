import {injectable} from 'inversify';

@injectable()
export class MockConfig {
  get(_identifier: string, _fallback?: string) {
    return '';
  }

  getArray(_identifier: string, _fallback?: string) {
    return [];
  }
}
