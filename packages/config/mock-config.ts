import {injectable} from 'inversify';

@injectable()
export class MockConfig {
  get(_identifier: string, _fallback?: string) {
    return '';
  }

  getNumber(_identifier: string, _fallback?: string) {
    return 0;
  }

  getArray(_identifier: string, _fallback?: string) {
    return [];
  }
}
