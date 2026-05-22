import axiosClient from '../api/axios-client';

// const PUBLIC_IMAGES_PREFIX = 'https://jualinbox.com/';

// const toPublicImageUrl = (key) => {
//   return `${PUBLIC_IMAGES_PREFIX}${key}`;
// };

export const R2Service = {
  uploadObject: async (fileName: string, fileContent: File) => {
    const type = fileContent.type;
    const { data } = await axiosClient.post<{ url: string }>('r2', { fileName, type });
    const { url } = data;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': type,
      },
      body: fileContent,
    });

    if (!response.ok) {
      throw new Error('Upload failed with status ' + String(response.status));
    }
  },
};
