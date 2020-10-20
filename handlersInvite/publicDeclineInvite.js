import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";
import { ses } from "blob-common/core/ses";

import { getInvite } from './inviteHelpers';
import { declineInviteBody, declineInviteText } from "../emails/declinedInvite";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const inviteId = event.pathParameters.id;
    // get invite (throws error if invite not found or user has no access to invite)
    const invite = await getInvite(userId, inviteId);

    // delete the invite
    await dynamoDb.delete({
        Key: { PK: invite.PK, SK: invite.SK },
    });

    // send message to invitor
    const params = {
        toName: invite.invitation.from.name,
        fromName: invite.user.name,
        groupName: invite.group.name,
        groupId: invite.group.SK
    };

    const niceBody = declineInviteBody(params);
    const textBody = declineInviteText(params);

    await ses.sendEmail({
        toEmail: invite.invitation.from.email,
        fromEmail: 'clubalmanac <wouter@clubalmanac.com>',
        subject: `Helaas! ${params.fromName} heeft je uitnodiging om lid te worden van "${params.groupName}" afgewezen`,
        data: niceBody,
        textData: textBody
    });

    return 'done';
});
