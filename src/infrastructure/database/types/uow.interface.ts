export interface UnityOfWorkInterface<T> {
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  getContext(): T;
}
