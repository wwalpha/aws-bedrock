import {
  GenerateImageRequest,
  GenerateImageResponse,
} from 'typings';
import useHttp from './useHttp';

const useImageApi = () => {
  const http = useHttp();

  return {
    generateImage: (params: GenerateImageRequest) => {
      return http.post<GenerateImageResponse>('/image/generate', params);
    },
  };
};

export default useImageApi;
