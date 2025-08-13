// 共通: sliceごとに loading / message キーを指定してAPI呼び出しの状態管理を自動化
export function withLoadingErrorCurried<Store>(
  set: (fn: (state: Store) => Partial<Store>) => void,
  loadingKey: keyof Store,
  messageKey: keyof Store
) {
  return function <Args extends any[], T>(apiFn: (...args: Args) => Promise<T>) {
    return async (...args: Args): Promise<T | undefined> => {
      set(() => ({ [loadingKey]: true, [messageKey]: null }) as Partial<Store>);
      try {
        const res = await apiFn(...args);
        return res;
      } catch (e: any) {
        set(() => ({ [messageKey]: e?.message || 'API error' }) as Partial<Store>);
        return undefined;
      } finally {
        set(() => ({ [loadingKey]: false }) as Partial<Store>);
      }
    };
  };
}
// 汎用APIラッパー: 任意のloading/errorキー・引数対応
export function withLoadingError<Store, Args extends any[], T>(
  set: (fn: (state: Store) => Partial<Store>) => void,
  loadingKey: keyof Store,
  messageKey: keyof Store,
  apiFn: (...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<T | undefined> => {
    set(() => ({ [loadingKey]: true, [messageKey]: null }) as Partial<Store>);
    try {
      const res = await apiFn(...args);
      return res;
    } catch (e: any) {
      set(() => ({ [messageKey]: e?.message || 'API error' }) as Partial<Store>);
      return undefined;
    } finally {
      set(() => ({ [loadingKey]: false }) as Partial<Store>);
    }
  };
}
export type SetStateAction<T> = T | ((prev: T) => T);

export function apply<T>(prev: T, value: SetStateAction<T>): T {
  return typeof value === 'function' ? (value as any)(prev) : value;
}
