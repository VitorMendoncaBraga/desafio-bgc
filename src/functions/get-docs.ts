import { APIGatewayProxyResult } from "aws-lambda";
import swaggerDocument from '../docs/swagger.json'
exports.getDocs = async function() : Promise<APIGatewayProxyResult> {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>BGC API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerDocument)},
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: html,
  };
}