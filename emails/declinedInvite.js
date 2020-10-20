import {
    dividerCell, emailBody, row, textCell,
    footerRow, greeting, headerRow, paragraph, signatureCell, makeEmailSrc
} from 'blob-common/core/email';

const dividerSrc = makeEmailSrc('public/img/invite_divider.png');
const baseUrl = process.env.frontend || process.env.devFrontend || 'https://localhost:3000';

export const declineInviteText = ({ toName, fromName, groupName, groupId }) => {
    const url = `${baseUrl}/personal/groups/${groupId}`;
    return `Hi ${toName}, Helaas! ${fromName} heeft je uitnodiging om lid te worden van "${groupName}" afgewezen 
Nieuws van anderen die wel lid zijn kun je vinden bij de club op ${url}`;
};

export const declineInviteBody = ({ toName, fromName, groupName, groupId }) => {
    const url = `${baseUrl}/personal/groups/${groupId}`;

    return emailBody([
        headerRow(makeEmailSrc('public/img/logo_email_1.png')),
        row([
            dividerCell(makeEmailSrc('public/img/declined.png')),
            textCell(greeting(`Hi ${toName},`)),
            textCell(paragraph(`Balen! ${fromName} heeft je uitnodiging om lid te worden van <strong><span style="font-size: 16px;">${groupName}</span></strong> afgewezen<br/>
            Typisch geval van ongepast eigen initiatief`)),
            textCell(paragraph(`Vind troost en gezelligheid bij vrienden op <a href="${url}">de ${groupName} pagina</a>`)),
            dividerCell(dividerSrc),
        ]),
        row([
            textCell(paragraph('We zien je graag terug op clubalmanac')),
            signatureCell(makeEmailSrc('public/img/signature_wouter.png'))
        ]),
        footerRow
    ]);
};