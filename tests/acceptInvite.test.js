import { otob } from 'blob-common/core/base64';
import { eventContext, testUserId2, testGroupId } from './context';
import { main as acceptInvite } from '../handlersInvite/acceptInvite';

const TIMEOUT = 2000;

const inviteIdForUser = otob({ PK: 'UM' + testUserId2, SK: testGroupId });
const inviteIdForEmail = otob({ PK: 'UMwouter.intvelt@gmail.com', SK: testGroupId });

// ONLY WORKS WITH 1 TEST SCENARIO (to prevent multiple invite mails)
describe('Process invite', () => {
    test('accept user invite for user', async () => {
        const event = eventContext({
            userId: testUserId2,
            pathParameters: { id: inviteIdForUser }
        })
        const response = await acceptInvite(event);
        expect(response.statusCode).toEqual(200);
    }, TIMEOUT + 3000);
    // test('accept email invite with higher role for existing member', async () => {
    //     const event = eventContext({
    //         userId: testUserId2,
    //         pathParameters: { id: inviteIdForEmail }
    //     })
    //     const response = await acceptInvite(event);
    // expect(response.statusCode).toEqual(200);
    // });
}, TIMEOUT + 3000);