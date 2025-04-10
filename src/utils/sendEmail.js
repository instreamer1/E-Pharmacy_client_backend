// src/utils/sendEmail.js

import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import env from './env.js';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

const sendEmail = async ({ to, subject, html }) => {

  const transporter = nodemailer.createTransport({
    host: env(SMTP.SMTP_HOST),
    port: Number(env(SMTP.SMTP_PORT)),
    auth: {
      user: env(SMTP.SMTP_USER),
      pass: env(SMTP.SMTP_PASSWORD),
    },
  });

  const mailOptions = {
    from: env(SMTP.SMTP_FROM),
    to,
    subject,
    html,
  };


  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

export const compileTemplate = async (templateName, variables) => {
  const filePath = path.resolve('src/utils/templates', `${templateName}.hbs`);
  const source = await fs.readFile(filePath, 'utf8');
  const template = handlebars.compile(source);
  return template(variables);
};

export default sendEmail;
