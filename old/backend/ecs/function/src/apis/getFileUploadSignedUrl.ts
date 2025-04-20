import { Request } from 'express';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 } from 'uuid';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.GetFileUploadSignedUrlRequest, any>
): Promise<APIs.GetFileUploadSignedUrlResponse> => {
  const { mediaFormat, filename } = req.body;

  const uuid = v4();

  // Create an S3 client service object
  const client = new S3Client({});

  // Create the command
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuid}/${filename}`,
    ContentType: mediaFormat,
  });

  // Send the command
  await client.send(command);

  // Create the signed URL
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  return signedUrl;
};
