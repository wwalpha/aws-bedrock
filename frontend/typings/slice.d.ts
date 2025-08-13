// 共通 Slice ヘルパー型
// Zustand の set 引数を型付けするための汎用ジェネリック
// state を受け取り部分更新 (Partial<S>) を返す関数を渡せるシグネチャ
export type SliceSet<S> = (fn: (state: S) => Partial<S>) => void;
