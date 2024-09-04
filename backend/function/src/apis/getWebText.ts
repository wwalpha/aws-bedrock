import { Request } from 'express';
import { parse } from 'node-html-parser';
import sanitizeHtml from 'sanitize-html';
import { APIs } from 'typings';

export default async (
  req: Request<any, any, APIs.GetWebTextRequest, APIs.GetWebTextQuery>
): Promise<APIs.GetWebTextResponse> => {
  const url = req.query['url'] as string;

  if (!url) {
    return { message: 'url is missing' };
  }

  const res = await fetch(url);
  const html = await res.text();
  // 不正なタグなどを補完
  const cleanHtml = sanitizeHtml(html, {
    // body と html がデフォルトで消えるため、それを防止するオプション
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'body', 'html'],
  });

  const root = parse(cleanHtml, {
    comment: false,
    blockTextElements: {
      script: false,
      noScript: false,
      style: false,
      pre: false,
    },
  });

  // @ts-ignore
  const text = root.querySelector('body').removeWhitespace().text;

  return {
    text,
  };
};
