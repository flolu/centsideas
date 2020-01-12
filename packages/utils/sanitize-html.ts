import * as sanitize from 'sanitize-html';

export const sanitizeHtml = (input: string): string => sanitize(input);
