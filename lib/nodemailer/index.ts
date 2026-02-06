import nodemailer from 'nodemailer'
import {NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, STOCK_ALERT_UPPER_EMAIL_TEMPLATE, STOCK_ALERT_LOWER_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";
import {evaluateAlertDirection} from "@/lib/utils";
import type {AlertItem} from "@/database/models/alert.model";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
      const htmlTemplate = WELCOME_EMAIL_TEMPLATE
          .replace('{{name}}', name)
          .replace('{{intro}}', intro);

      const mailOptions = {
          from: `"Signalist" <signalist@jsmastery.pro>`,
          to: email,
          subject: `Welcome to Signalist - your stock market toolkit is ready`,
          text: `Thanks for joining Signalist`,
          html: htmlTemplate,
      }

      await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    {email, date, newsContent }: {email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Signalist" <signalist@jsmastery.pro>`,
        to: email,
        subject: `Here's your market news for today - ${date}`,
        text: `Today's market news from Signalist`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export const sendAlertEmail = async (
    {email, symbol, timestamp, company, currentPrice, targetPrice, alertDoc}: {email: string; symbol: string; timestamp: string; company: string; currentPrice: number; targetPrice: number; alertDoc: AlertItem;}
): Promise<void> => {
    const direction = evaluateAlertDirection(alertDoc, currentPrice)
    switch (direction) {
        case "upper":
            await sendUpperAlertEmail({email, symbol, timestamp, company, currentPrice, targetPrice});
            return;
        case "lower":
            await sendLowerAlertEmail({email, symbol, timestamp, company, currentPrice, targetPrice})
            return;
        case "equal":
            // TODO: handle "equal" alerts if/when a template is added
            return;
        default:
            // Condition not met — no email needed
            return;
    }
};

export const sendLowerAlertEmail = async (
    {email, symbol, timestamp, company, currentPrice, targetPrice}: {email: string; symbol: string; timestamp: string; company: string; currentPrice: number; targetPrice: number}
) => {
    const htmlTemplate = STOCK_ALERT_LOWER_EMAIL_TEMPLATE
        .replaceAll('{{symbol}}', symbol)
        .replaceAll('{{timestamp}}', timestamp)
        .replaceAll('{{company}}', company)
        .replaceAll('{{currentPrice}}', currentPrice.toString())
        .replaceAll('{{targetPrice}}', targetPrice.toString());


    const mailOptions = {
        from: `"Signalist" <signalist@jsmastery.pro>`,
        to: email,
        subject: `${symbol}'s is below your target price`,
        text: `Signalist Alerts are remarkable, huh?`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export const sendUpperAlertEmail = async (
    {email, symbol, timestamp, company, currentPrice, targetPrice}: {email: string; symbol: string; timestamp: string; company: string; currentPrice: number; targetPrice: number}
) => {
    const htmlTemplate = STOCK_ALERT_UPPER_EMAIL_TEMPLATE
        .replace('{{symbol}}', symbol)
        .replace('{{timestamp}}', timestamp)
        .replace('{{company}}', company)
        .replace('{{currentPrice}}', currentPrice.toString())
        .replace('{{targetPrice}}', targetPrice.toString());


    const mailOptions = {
        from: `"Signalist" <signalist@jsmastery.pro>`,
        to: email,
        subject: `${symbol}'s is above your target price`,
        text: `Signalist Alerts are remarkable, huh?`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};