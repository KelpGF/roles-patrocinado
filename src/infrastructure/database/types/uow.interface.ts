export interface UnityOfWorkInterface<T = any> {
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  getContext(): T;
}
