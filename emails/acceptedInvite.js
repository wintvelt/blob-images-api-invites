import {
    dividerCell, emailBody, row, textCell,
    footerRow, greeting, headerRow, paragraph, signatureCell, makeEmailSrc
} from 'blob-common/core/email';

const dividerSrc = makeEmailSrc('public/img/invite_divider.png');
const baseUrl = process.env.frontend || process.env.devFrontend || 'https://localhost:3000';

export const acceptInviteText = ({ toName, fromName, groupName, groupId }) => {
    const url = `${baseUrl}/personal/groups/${groupId}`;
    return `Hi ${toName}, ${fromName} heeft je uitnodiging om lid te worden van "${groupName}" geaccepteerd! 
Bezoek ${url} om te kijken of er nieuws is`;
};

export const acceptInviteBody = ({ toName, fromName, groupName, groupId }) => {
    const url = `${baseUrl}/personal/groups/${groupId}`;

    return emailBody([
        headerRow(makeEmailSrc('public/img/logo_email_1.png')),
        row([
            dividerCell(makeEmailSrc('public/img/accepted.png')),
            textCell(greeting(`Hi ${toName},`)),
            textCell(paragraph(`Yeey! ${fromName} heeft je uitnodiging om lid te worden van <strong><span style="font-size: 16px;">${groupName}</span></strong> geaccepteerd(en terecht)`)),
            textCell(paragraph(`Kijk op <a href="${url}">de ${groupName} pagina</a> om te zien of er nieuws is`)),
            dividerCell(dividerSrc),
        ]),
        row([
            textCell(paragraph('We zien je graag terug op clubalmanac')),
            signatureCell(makeEmailSrc('public/img/signature_wouter.png'))
        ]),
        footerRow
    ]);
};