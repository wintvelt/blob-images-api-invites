import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb, dbUpdate } from "blob-common/core/db";
import { ses } from "blob-common/core/ses";
import { dbItem } from "blob-common/core/dbCreate";
import { cleanRecord } from "blob-common/core/dbClean";
import { getInvite } from './inviteHelpers';

import { getMemberAndInvite } from "../libs/dynamodb-lib-single";
import { getUser } from "../libs/dynamodb-lib-user";
import { acceptInviteText, acceptInviteBody } from "../emails/acceptedInvite";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const inviteId = event.pathParameters.id;
    // get invite (throws error if user has no access to invite)
    const invite = await getInvite(userId, inviteId);

    // check if invite is to user
    const inviteIsForThisUser = (invite.PK.slice(2) === userId);

    if (inviteIsForThisUser) {
        // update the invite to membership
        await dbUpdate(invite.PK, invite.SK, 'status', 'active');
    } else {
        // invite is an email - create or update membership for this user
        let TransactItems = [
            {
                Delete: {
                    Key: { PK: invite.PK, SK: invite.SK },
                }
            },
        ];
        const user = await getUser(userId);
        // user may already be a member or invitee (maybe with different email)
        const membership = await getMemberAndInvite(userId, invite.SK);
        const isStillInvite = (membership && membership.status === 'invite');
        const hasBetterRoleForMember = (membership && !isStillInvite && membership.role === 'guest' && invite.role === 'admin');
        if (hasBetterRoleForMember) TransactItems.push({
            Update: {
                Key: { PK: 'UM' + userId, SK: invite.SK },
                UpdateExpression: 'SET #r = :r, #i = :i, #s = :s',
                ExpressionAttributeNames: { '#r': 'role', '#i': 'invitation', '#s': 'status' },
                ExpressionAttributeValues: { ':r': invite.role, ':i': invite.invitation, ':s': 'active' },
            }
        });
        if (!membership || isStillInvite) TransactItems.push({
            Put: {
                Item: dbItem({
                    PK: 'UM' + userId,
                    SK: invite.SK,
                    user: cleanRecord(user),
                    invitation: invite.invitation,
                    group: invite.group,
                    role: invite.role,
                    status: 'active'
                })
            }
        });
        await dynamoDb.transact({ TransactItems });
    }
    // send message to invitor
    const params = {
        toName: invite.invitation.from.name,
        fromName: invite.user.name,
        groupName: invite.group.name,
        groupId: invite.group.SK,
        photoUrl: invite.group.photo?.url
    };

    const niceBody = acceptInviteBody(params);
    const textBody = acceptInviteText(params);

    await ses.sendEmail({
        toEmail: invite.invitation.from.email,
        fromEmail: 'clubalmanac <wouter@clubalmanac.com>',
        subject: `${params.fromName} heeft je uitnodiging om lid te worden van "${params.groupName}" geaccepteerd`,
        data: niceBody,
        textData: textBody
    });

    return 'done';
});
