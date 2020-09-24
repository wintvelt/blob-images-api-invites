import { dynamoDb } from 'blob-common/core/db';

export const getMember = async (userId, groupId) => {
    const memberParams = {
        Key: {
            PK: 'UM' + userId,
            SK: groupId
        },
    };
    const result = await dynamoDb.get(memberParams);
    return (result.Item);
};