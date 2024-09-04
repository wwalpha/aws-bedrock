import { Request } from 'express';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { APIs } from 'typings';

const client = new S3Client({});

export default async (req: Request<any, any, APIs.DeleteFileRequest, any>): Promise<APIs.DeleteFileResponse> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: req.body.fileName,
  });

  await client.send(command);
};
