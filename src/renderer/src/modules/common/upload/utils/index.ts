import SparkMD5 from 'spark-md5';

import { ChunkFile } from '../types';

/**
 * 获取文件 hash 值以及后缀名
 * @param file 文件
 * @returns
 */
export const getFileHash = (
  file: File
): Promise<{
  buffer?: string | ArrayBuffer | null | undefined;
  HASH?: string;
  suffix?: string;
  filename?: string;
}> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (ev) => {
      const buffer = ev.target?.result;
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(buffer);
      const HASH = spark.end();
      const suffix = file.name.substring(file.name.lastIndexOf('.') + 1);

      resolve({
        buffer,
        HASH,
        suffix,
        filename: `${HASH}.${suffix}`
      });
    };
  });
};

/**
 * 获取文件分片 Chunk
 * @param file 文件
 * @param chunkSize 单个分片大小
 * @param maxChunkCount 切片最大数
 * @returns
 */

export const getFileChunks = async (
  file: File,
  chunkSize: number,
  maxChunkCount: number
): Promise<{ chunks: ChunkFile[]; HASH: string; count: number }> => {
  // 固定数量 & 固定大小并存处理每个切片大小以及切片数量
  let curChunkSize = chunkSize;
  let count = Math.ceil(file.size / curChunkSize);
  let index = 0;
  if (count > maxChunkCount) {
    curChunkSize = file.size / maxChunkCount;
    count = maxChunkCount;
  }

  const chunks: ChunkFile[] = [];
  const { HASH, suffix } = await getFileHash(file);
  while (index < count) {
    chunks.push({
      file: file.slice(index * curChunkSize, (index + 1) * curChunkSize),
      filename: `${HASH}_${index + 1}.${suffix}`
    });
    index++;
  }

  return {
    chunks,
    HASH: HASH!,
    count
  };
};
