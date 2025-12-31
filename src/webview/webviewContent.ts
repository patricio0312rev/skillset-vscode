import { styles } from './templates/styles';
import { layout } from './templates/layout';
import { scriptTemplate } from './templates/scriptTemplate';
import { TOOLS_DATA } from './data/tools';
import { DOMAINS_DATA } from './data/domains';

/**
 * Generate complete HTML content for the webview
 * @param nonce Security nonce for inline scripts
 * @returns Complete HTML document
 */
export function getWebviewContent(nonce: string): string {
  // Serialize data for injection into script
  const toolsJson = JSON.stringify(TOOLS_DATA);
  const domainsJson = JSON.stringify(DOMAINS_DATA);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}' https://cdn.jsdelivr.net;">
      <title>SkillSet Manager</title>
      ${styles}
    </head>
    <body>
      ${layout}
      <script type="module" nonce="${nonce}">
${scriptTemplate(toolsJson, domainsJson)}
      </script>
    </body>
    </html>
  `;
}
