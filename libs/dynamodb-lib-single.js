import { expireDate, now } from 'blob-common/core/base64';
import { dynamoDb } from 'blob-common/core/db';

export const getMemberAndInvite = async (userId, groupId) => {
    const today = now();
    const memberParams = {
        Key: {
            PK: 'UM' + userId,
            SK: groupId
        },
    };
    const result = await dynamoDb.get(memberParams);
    const item = result.Item;
    if (!item) return undefined;
    if (item.status === 'invite' && expireDate(item.createdAt) < today) return undefined;
    return item;
};