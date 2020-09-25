import { otob } from 'blob-common/core/base64';
import { eventContext, testUserId2, testUserId ,testGroupId, sleep } from './context';
import { main as getInvite } from '../handlersInvite/publicGetInvite';
import { main as acceptInvite } from '../handlersInvite/acceptInvite';
import { main as declineInvite } from '../handlersInvite/publicDeclineInvite';

const TIMEOUT = 2000;

const inviteIdForUser = otob({ PK: 'UM' + testUserId2, SK: testGroupId });
const inviteIdForEmail = otob({ PK: 'UMwouter.intvelt@gmail.com', SK: testGroupId });
const inviteEvent = (inviteId, userId = 'anonymous user') => eventContext({
    userId,
    pathParameters: { id: inviteId }
});

// AFTER GROUP TEST ROUND 2
describe('Invite retrieval tests', () => {
    it('Retrieve a user invite for a different user', async () => {
        const response = await getInvite(inviteEvent(inviteIdForUser));
        expect(response.statusCode).toEqual(500);
    }, TIMEOUT + 5000);
    it('Retrieve a user invite for this user', async () => {
        const response = await getInvite(inviteEvent(inviteIdForUser, testUserId2));
        expect(response.statusCode).toEqual(200);
    }, TIMEOUT + 5000);
    it('Retrieve an email invite', async () => {
        const response = await getInvite(inviteEvent(inviteIdForEmail, testUserId2));
        expect(response.statusCode).toEqual(200);
    }, TIMEOUT + 5000);
});

// ONLY WORKS WITH 1 TEST SCENARIO (to prevent multiple invite mails)
describe('Process invite', () => {
    // test('accept user invite for new member', async () => {
    //     const event = eventContext({
    //         userId: testUserId2,
    //         pathParameters: { id: inviteIdForUser }
    //     })
    //     const response = await acceptInvite(event);
    //     expect(response.statusCode).toEqual(200);
    // }, TIMEOUT + 3000);
    // test('accept email invite with higher role for existing member', async () => {
    //     const event = eventContext({
    //         userId: testUserId2,
    //         pathParameters: { id: inviteIdForEmail }
    //     })
    //     const response = await acceptInvite(event);
    // expect(response.statusCode).toEqual(200);
    // });
    // test('decline email invite for diff existing member', async () => {
    //     const event = eventContext({
    //         userId: testUserId,
    //         pathParameters: { id: inviteIdForUser }
    //     });
    //     const response = await declineInvite(event);
    //     expect(response.statusCode).toEqual(500);
    // });
    // test('decline email invite for same existing member', async () => {
    //     const event = eventContext({
    //         userId: testUserId2,
    //         pathParameters: { id: inviteIdForUser }
    //     });
    //     const response = await declineInvite(event);
    //     expect(response.statusCode).toEqual(200);
    // });
}, TIMEOUT + 3000);