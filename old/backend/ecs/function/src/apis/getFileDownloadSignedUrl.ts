import { Request } from 'express';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.GetFileDownloadSignedUrlRequest, any>
): Promise<APIs.GetFileDownloadSignedUrlResponse> => {
  const { bucketName, filePrefix, contentType } = req.body;

  // Create an S3 client service object
  const client = new S3Client({});

  // Create the command
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: filePrefix,
    ResponseContentType: contentType,
  });

  // Send the command
  await client.send(command);

  // Create the signed URL
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 60 });

  return signedUrl;
};
