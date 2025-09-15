import { Resend } from 'resend';

// This is to allow us to config resend
export const resend = new Resend(process.env.RESEND_API_KEY);