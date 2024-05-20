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
  hash?: string;
  suffix?: string;
  filename?: string;
}> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();

    reader.readAsArrayBuffer(file);
    reader.onload = (ev) => {
      const buffer = ev.target?.result;
      spark.append(buffer);
      const hash = spark.end();
      const suffix = file.name.substring(file.name.lastIndexOf('.') + 1);

      resolve({
        buffer,
        hash,
        suffix,
        filename: `${hash}.${suffix}`
      });
    };
  });
};

/**
 * 抽样计算文件 hash
 *
 * 抽样规则:
 * - 第一个和最后一个切片的内容全部参与计算
 * - 中间剩余的切片我们分别在前面、后面和中间取2个字节参与计算
 *
 * @param file 文件内容
 * @param fileChunks 文件 chunks
 * @param chunkSize 每个chunk 大小
 * @returns
 */
export const calculateHash = (
  file: File,
  fileChunks: ChunkFile[],
  chunkSize: number
): Promise<{
  hash?: string;
  suffix?: string;
  filename?: string;
}> => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const chunks: Blob[] = [];

    fileChunks.forEach((chunkItem, index) => {
      if (index === 0 || index === fileChunks.length - 1) {
        // 第一个和最后一个切片的内容全部参与计算
        chunks.push(chunkItem.file);
      } else {
        // 中间剩余的切片我们分别在前面、中间、后面各取2个字节参与计算
        chunks.push(chunkItem.file.slice(0, 2));
        chunks.push(chunkItem.file.slice(chunkSize / 2, chunkSize / 2 + 2));
        chunks.push(chunkItem.file.slice(chunkSize - 2, chunkSize));
      }
    });

    const reader = new FileReader();
    reader.readAsArrayBuffer(new Blob(chunks));
    reader.onload = (ev) => {
      const buffer = ev.target?.result;
      spark.append(buffer);
      const hash = spark.end();
      const suffix = file.name.substring(file.name.lastIndexOf('.') + 1);

      resolve({
        hash,
        suffix,
        filename: `${hash}.${suffix}`
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
): Promise<{ chunks: ChunkFile[]; hash: string; count: number }> => {
  // 固定数量 & 固定大小并存处理每个切片大小以及切片数量
  let curChunkSize = chunkSize;
  let count = Math.ceil(file.size / curChunkSize);
  let index = 0;
  if (count > maxChunkCount) {
    curChunkSize = file.size / maxChunkCount;
    count = maxChunkCount;
  }

  const chunks: ChunkFile[] = [];
  const { hash, suffix } = await calculateHash(file, chunks, chunkSize);
  while (index < count) {
    chunks.push({
      file: file.slice(index * curChunkSize, (index + 1) * curChunkSize),
      filename: `${hash}_${index + 1}.${suffix}`
    });
    index++;
  }

  return {
    chunks,
    hash: hash!,
    count
  };
};
