import type { LensterAttachment } from '@generated/lenstertypes';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadMediaToIPFS = async (data: any): Promise<LensterAttachment[]> => {
  try {
    const files = Array.from(data);
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data.item(i);
        const formData = new FormData();
        formData.append('data', file, uuid());

        const upload = await axios(`https://shuttle-4.estuary.tech/content/add`, {
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ESTUARY_KEY}`
          }
        });
        const { cid }: { cid: string } = await upload.data;

        return {
          item: `ipfs://${cid}`,
          type: file.type,
          altTag: ''
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

export default uploadMediaToIPFS;
