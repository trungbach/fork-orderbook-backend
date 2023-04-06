import { RequestTimeoutException } from '@nestjs/common';

export const sleep = async (time = 10000) => {
  await new Promise((resolve) => setTimeout(() => resolve(true), time));
};

export const fetchWithTimeout = async (
  url: string,
  options: any,
  timeout = 10000,
) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new RequestTimeoutException(url || 'timeout')),
        timeout,
      ),
    ),
  ]);
};

export const validateOraiAddress = (address: string): boolean => {
    const addressLength = address.length;
    if (addressLength === 43 || addressLength === 63) {
        return true
    }
    return false
}