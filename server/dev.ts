import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { processContactRequest } from './contact';

dotenv.config({ path: '.env.local' });

const PORT = 3001;
const MAX_BODY_SIZE = 64 * 1024;

const server = createServer(async (request, response) => {
  if (request.url !== '/api/contact') {
    response.writeHead(404, {
      'Content-Type': 'application/json',
    });

    response.end(
      JSON.stringify({
        error: 'Not found',
      }),
    );

    return;
  }

  if (request.method !== 'POST') {
    response.writeHead(405, {
      'Content-Type': 'application/json',
      Allow: 'POST',
    });

    response.end(
      JSON.stringify({
        error: 'Method not allowed',
      }),
    );

    return;
  }

  try {
    let rawBody = '';

    for await (const chunk of request) {
      rawBody += chunk;

      if (Buffer.byteLength(rawBody) > MAX_BODY_SIZE) {
        response.writeHead(413, {
          'Content-Type': 'application/json',
        });

        response.end(
          JSON.stringify({
            error: 'Request body too large',
          }),
        );

        return;
      }
    }

    const body = JSON.parse(rawBody);

    const result = await processContactRequest(body);

    response.writeHead(result.status, {
      'Content-Type': 'application/json',
    });

    response.end(JSON.stringify(result.body));
  } catch (error) {
    console.error('Contact API error:', error);

    response.writeHead(400, {
      'Content-Type': 'application/json',
    });

    response.end(
      JSON.stringify({
        error: 'Invalid request',
      }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`AXION contact API running on http://localhost:${PORT}`);
});
