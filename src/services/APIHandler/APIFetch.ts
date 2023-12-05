import { config } from '@APIConfig';
import { APIBaseParams } from './types';

async function APIFetch({ method, url, body, customHeaders }: APIBaseParams) {
  
  const headers = {
    platform: 'ios',
    'Acces-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    authority: config.authority,
    Host: config.host,
    origin: config.origin,
    referer: config.referer,
    Connection: 'Keep-Alive',
    'Accept-Encoding': 'gzip',
    'User-Agent': 'okhttp/3.12.0',
    'X-Web-Version': '3362',
    ...customHeaders
  };

  const postBody = body ? JSON.stringify(body) : undefined;

  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: postBody,
  });

  if (!response.ok) {
    throw new Error(
      `Error Response: ${response.status} ${response.statusText}`,
    );
  }

  return response;

}

export default APIFetch;
