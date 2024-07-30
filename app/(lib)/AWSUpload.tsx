import { useApolloClient } from '@apollo/client';
import { GET_SIGNED_URL } from '../(queries)/queries';

type FileType = 'PROFILE';

type UploadType = {
  getSignedUrl: string;
};

export const useAWSUpload = () => {
  const client = useApolloClient();

  const uploadToS3 = async (file: File, fileType: FileType) => {
    try {
      const { data } = await client.query<UploadType>({
        query: GET_SIGNED_URL,
        variables: {
          fileType,
          fileName: file.name,
        },
      });

      if (data?.getSignedUrl) {
        await fetch(data.getSignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        const url = new URL(data.getSignedUrl);
        const fileName = url.pathname.substring(1);
        return fileName;
      } else {
        throw new Error('Signed URL not fetched!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return '';
    }
  };

  return { uploadToS3 };
};
