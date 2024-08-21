import { create } from 'zustand';
import useFileApi from './useFileApi';
import { FileLimit, UploadedFileType } from 'typings';
import { produce } from 'immer';
import { fileTypeFromStream } from 'file-type';

export const extractBaseURL = (url: string) => {
  return url.split(/[?#]/)[0];
};
const useFilesState = create<{
  uploadFiles: (files: File[], fileLimit?: FileLimit) => Promise<void>;
  uploadedFiles: UploadedFileType[];
  errorMessages: string[];
  deleteUploadedFile: (fileUrl: string) => Promise<boolean>;
  clear: () => void;
}>((set, get) => {
  const api = useFileApi();

  const clear = () => {
    set(() => ({
      errorMessages: [],
      uploadedFiles: [],
    }));
  };

  const uploadFiles = async (files: File[], fileLimit?: FileLimit) => {
    // 現在のファイル数を取得
    const currentUploadedFiles = get().uploadedFiles;
    let fileCount = currentUploadedFiles.filter(
      (file) => file.type === 'file'
    ).length;
    let imageFileCount = currentUploadedFiles.filter(
      (file) => file.type === 'image'
    ).length;

    // アップロードされたファイルの検証
    const errorMessages: string[] = [];
    const isMimeSpoofedResults = await Promise.all(
      files.map(async (file) => {
        // filter は非同期関数が利用できないため先に評価を行う
        // file.type は拡張子ベースで MIME を取得する一方、fileTypeFromStream はファイルヘッダの Signature を確認する
        const realMimeType = (await fileTypeFromStream(file.stream()))?.mime;
        const isMimeSpoofed =
          file.type && realMimeType && file.type != realMimeType;
        return isMimeSpoofed;
      })
    );
    const uploadedFiles: UploadedFileType[] = files
      .filter((file, idx) => {
        // ファイルの拡張子が間違っている場合はフィルタリング
        if (isMimeSpoofedResults[idx]) {
          errorMessages.push(
            `${file.name} はファイルタイプと拡張子が合致しないファイルです。`
          );
        }
        return !isMimeSpoofedResults[idx];
      })
      .filter((file) => {
        // 許可されたファイルタイプをフィルタリング
        const mediaFormat = ('.' + file.name.split('.').pop()) as string;
        const isFileAllowed = fileLimit?.accept.includes(mediaFormat);
        if (!isFileAllowed) {
          errorMessages.push(
            `${file.name} は許可されていない拡張子です。利用できる拡張子は ${fileLimit?.accept.join(', ')} です`
          );
        }
        return isFileAllowed;
      })
      .filter((file) => {
        // ファイルサイズによるフィルタリング
        const maxSizeMB =
          (file.type.includes('image')
            ? fileLimit?.maxImageFileSizeMB
            : fileLimit?.maxFileSizeMB) || 0;
        const isFileAllowed = file.size <= maxSizeMB * 1e6;
        if (!isFileAllowed) {
          errorMessages.push(
            `${file.name} は最大ファイルサイズ ${maxSizeMB} MB を超えています。`
          );
        }
        return isFileAllowed;
      })
      .filter((file) => {
        // ファイル数によるフィルタリング
        let isFileAllowed = false;
        if (file.type.includes('image')) {
          imageFileCount += 1;
          isFileAllowed = imageFileCount <= (fileLimit?.maxImageFileCount || 0);
          if (!isFileAllowed) {
            errorMessages.push(
              `画像ファイルは ${fileLimit?.maxImageFileCount} 個以下にしてください`
            );
          }
        } else {
          fileCount += 1;
          isFileAllowed = fileCount <= (fileLimit?.maxFileCount || 0);
          if (!isFileAllowed) {
            errorMessages.push(
              `ファイルは ${fileLimit?.maxFileCount} 個以下にしてください`
            );
          }
        }
        return isFileAllowed;
      })
      .map((file) => ({
        file,
        name: file.name,
        type: file.type.includes('image') ? 'image' : 'file',
        uploading: true,
      }));

    set(() => ({
      uploadedFiles: produce(get().uploadedFiles, (draft) => {
        draft.push(...uploadedFiles);
      }),
      errorMessages: [...new Set(errorMessages)],
    }));

    get().uploadedFiles.forEach((uploadedFile, idx) => {
      // 「画像アップロード => 署名付きURL取得 => 画像ダウンロード」だと、画像が画面に表示されるまでに時間がかかるため、
      // 選択した画像をローカルでBASE64エンコーディングし、そのまま画面に表示する（UX改善のため）
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile.file);
      reader.onload = () => {
        set(() => ({
          uploadedFiles: produce(get().uploadedFiles, (draft) => {
            draft[idx].base64EncodedData = reader.result?.toString();
          }),
        }));
      };

      const mediaFormat = uploadedFile.file.name.split('.').pop() as string;

      // 署名付き URL の取得（並列実行させるために、await せずに実行）
      api
        .getSignedUrl({
          filename: uploadedFile.file.name,
          mediaFormat: mediaFormat,
        })
        .then(async (signedUrlRes) => {
          const signedUrl = signedUrlRes.data;
          const fileUrl = extractBaseURL(signedUrl); // 署名付き url からクエリパラメータを除外
          // ファイルのアップロード
          api.uploadFile(signedUrl, { file: uploadedFile.file }).then(() => {
            set({
              uploadedFiles: produce(get().uploadedFiles, (draft) => {
                draft[idx].uploading = false;
                draft[idx].s3Url = fileUrl;
              }),
            });
          });
        });
    });
  };

  const deleteUploadedFile = async (fileUrl: string) => {
    const baseUrl = extractBaseURL(fileUrl);
    const findTargetIndex = () =>
      get().uploadedFiles.findIndex((file) => file.s3Url === baseUrl);
    let targetIndex = findTargetIndex();

    if (targetIndex > -1) {
      // "https://BUCKET_NAME.s3.REGION.amazonaws.com/FILENAME"の形式で設定されている
      const result = /https:\/\/.+\/(?<fileName>.+)/.exec(
        get().uploadedFiles[targetIndex].s3Url ?? ''
      );
      const fileName = result?.groups?.fileName;

      if (fileName) {
        set({
          uploadedFiles: produce(get().uploadedFiles, (draft) => {
            draft[targetIndex].deleting = true;
          }),
        });

        await api.deleteUploadedFile(fileName);

        // 削除処理中に他の画像も削除された場合に、Indexがズレるため再取得する
        targetIndex = findTargetIndex();

        set({
          uploadedFiles: produce(get().uploadedFiles, (draft) => {
            draft.splice(targetIndex, 1);
          }),
        });
        return true;
      }
    }
    return false;
  };

  return {
    clear,
    uploadedFiles: [],
    errorMessages: [],
    uploadFiles,
    deleteUploadedFile,
  };
});

const useFiles = () => {
  const {
    uploadFiles,
    clear,
    uploadedFiles,
    deleteUploadedFile,
    errorMessages,
  } = useFilesState();
  return {
    uploadFiles,
    errorMessages,
    clear,
    uploadedFiles: uploadedFiles.filter((file) => !file.deleting),
    deleteUploadedFile,
    uploading: uploadedFiles.some((uploadedFile) => uploadedFile.uploading),
  };
};
export default useFiles;
