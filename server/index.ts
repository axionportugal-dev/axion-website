import dotenv from 'dotenv';

import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';

import {
  readFile,
  stat,
} from 'node:fs/promises';

import {
  createReadStream,
} from 'node:fs';

import {
  gzipSync,
} from 'node:zlib';

import path from 'node:path';

import {
  processContactRequest,
} from './contact';

dotenv.config({
  path: '.env.local',
  quiet: true,
});

const PORT =
  Number(process.env.PORT) || 3000;

const DIST_DIR =
  path.resolve(
    process.cwd(),
    'dist',
  );

const MAX_BODY_SIZE =
  64 * 1024;

const CONTACT_RATE_LIMIT_WINDOW_MS =
  15 * 60 * 1000;

const CONTACT_RATE_LIMIT_MAX =
  5;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const contactRateLimits =
  new Map<
    string,
    RateLimitEntry
  >();

const COMPRESSIBLE_EXTENSIONS =
  new Set([
    '.html',
    '.js',
    '.css',
    '.json',
    '.xml',
    '.txt',
    '.svg',
  ]);

const MIME_TYPES: Record<
  string,
  string
> = {
  '.html':
    'text/html; charset=utf-8',

  '.js':
    'text/javascript; charset=utf-8',

  '.css':
    'text/css; charset=utf-8',

  '.json':
    'application/json; charset=utf-8',

  '.xml':
    'application/xml; charset=utf-8',

  '.txt':
    'text/plain; charset=utf-8',

  '.png':
    'image/png',

  '.jpg':
    'image/jpeg',

  '.jpeg':
    'image/jpeg',

  '.webp':
    'image/webp',

  '.svg':
    'image/svg+xml',

  '.ico':
    'image/x-icon',

  '.mp4':
    'video/mp4',

  '.woff':
    'font/woff',

  '.woff2':
    'font/woff2',
};

const setSecurityHeaders = (
  response: ServerResponse,
) => {
  response.setHeader(
    'X-Content-Type-Options',
    'nosniff',
  );

  response.setHeader(
    'X-Frame-Options',
    'DENY',
  );

  response.setHeader(
    'Referrer-Policy',
    'strict-origin-when-cross-origin',
  );

  response.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );

  if (
    process.env.NODE_ENV ===
    'production'
  ) {
    response.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
  }
};

const sendJson = (
  request: IncomingMessage,
  response: ServerResponse,
  status: number,
  body: unknown,
) => {
  const payload =
    JSON.stringify(body);

  response.writeHead(
    status,
    {
      'Content-Type':
        'application/json; charset=utf-8',

      'Content-Length':
        Buffer.byteLength(
          payload,
        ),

      'Cache-Control':
        'no-store',
    },
  );

  if (
    request.method ===
    'HEAD'
  ) {
    response.end();
    return;
  }

  response.end(
    payload,
  );
};

const readJsonBody =
  async (
    request: IncomingMessage,
  ): Promise<unknown> => {
    let rawBody = '';

    for await (
      const chunk of request
    ) {
      rawBody += chunk;

      if (
        Buffer.byteLength(
          rawBody,
        ) >
        MAX_BODY_SIZE
      ) {
        throw new Error(
          'BODY_TOO_LARGE',
        );
      }
    }

    if (!rawBody) {
      throw new Error(
        'EMPTY_BODY',
      );
    }

    return JSON.parse(
      rawBody,
    );
  };

const sendFile =
  async (
    request: IncomingMessage,
    response: ServerResponse,
    filePath: string,
    statusCode = 200,
  ) => {
    const extension =
      path.extname(
        filePath,
      ).toLowerCase();

    const contentType =
      MIME_TYPES[
        extension
      ] ??
      'application/octet-stream';

    const fileStat =
      await stat(
        filePath,
      );

    const fileSize =
      fileStat.size;

    const isHashedAsset =
      filePath.includes(
        `${path.sep}assets${path.sep}`,
      ) &&
      /-[A-Za-z0-9_-]{6,}\./.test(
        path.basename(
          filePath,
        ),
      );

    const cacheControl =
      isHashedAsset
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate';

    const supportsRanges =
      extension === '.mp4';

    const rangeHeader =
      supportsRanges
        ? request.headers.range
        : undefined;

    /*
     * Browsers commonly use HTTP byte-range requests for MP4
     * playback. Return 206 Partial Content when Range is present.
     */
    if (rangeHeader) {
      const match =
        /^bytes=(\d*)-(\d*)$/.exec(
          rangeHeader.trim(),
        );

      if (!match) {
        response.writeHead(
          416,
          {
            'Content-Range':
              `bytes */${fileSize}`,

            'Accept-Ranges':
              'bytes',

            'Cache-Control':
              cacheControl,
          },
        );

        response.end();
        return;
      }

      const rawStart =
        match[1];

      const rawEnd =
        match[2];

      let startByte: number;
      let endByte: number;

      if (
        rawStart === '' &&
        rawEnd !== ''
      ) {
        const suffixLength =
          Number(rawEnd);

        if (
          !Number.isFinite(
            suffixLength,
          ) ||
          suffixLength <= 0
        ) {
          response.writeHead(
            416,
            {
              'Content-Range':
                `bytes */${fileSize}`,

              'Accept-Ranges':
                'bytes',

              'Cache-Control':
                cacheControl,
            },
          );

          response.end();
          return;
        }

        startByte =
          Math.max(
            fileSize -
              suffixLength,
            0,
          );

        endByte =
          fileSize - 1;
      } else {
        startByte =
          rawStart
            ? Number(rawStart)
            : 0;

        endByte =
          rawEnd
            ? Number(rawEnd)
            : fileSize - 1;
      }

      if (
        !Number.isInteger(
          startByte,
        ) ||
        !Number.isInteger(
          endByte,
        ) ||
        startByte < 0 ||
        endByte < 0 ||
        startByte >= fileSize ||
        startByte > endByte
      ) {
        response.writeHead(
          416,
          {
            'Content-Range':
              `bytes */${fileSize}`,

            'Accept-Ranges':
              'bytes',

            'Cache-Control':
              cacheControl,
          },
        );

        response.end();
        return;
      }

      endByte =
        Math.min(
          endByte,
          fileSize - 1,
        );

      const contentLength =
        endByte -
        startByte +
        1;

      response.writeHead(
        206,
        {
          'Content-Type':
            contentType,

          'Content-Length':
            contentLength,

          'Content-Range':
            `bytes ${startByte}-${endByte}/${fileSize}`,

          'Accept-Ranges':
            'bytes',

          'Cache-Control':
            cacheControl,
        },
      );

      if (
        request.method ===
        'HEAD'
      ) {
        response.end();
        return;
      }

      createReadStream(
        filePath,
        {
          start:
            startByte,

          end:
            endByte,
        },
      ).pipe(
        response,
      );

      return;
    }

    const file =
      await readFile(
        filePath,
      );

    const acceptsGzip =
      request.headers[
        'accept-encoding'
      ]?.includes(
        'gzip',
      ) ?? false;

    const isCompressible =
      COMPRESSIBLE_EXTENSIONS.has(
        extension,
      );

    const shouldCompress =
      acceptsGzip &&
      isCompressible;

    const body =
      shouldCompress
        ? gzipSync(file)
        : file;

    response.writeHead(
      statusCode,
      {
        'Content-Type':
          contentType,

        'Content-Length':
          body.byteLength,

        'Cache-Control':
          cacheControl,

        ...(supportsRanges
          ? {
              'Accept-Ranges':
                'bytes',
            }
          : {}),

        ...(isCompressible
          ? {
              Vary:
                'Accept-Encoding',
            }
          : {}),

        ...(shouldCompress
          ? {
              'Content-Encoding':
                'gzip',
            }
          : {}),
      },
    );

    if (
      request.method ===
      'HEAD'
    ) {
      response.end();
      return;
    }

    response.end(body);
  };

const serve404 =
  async (
    request: IncomingMessage,
    response: ServerResponse,
  ) => {
    const filePath =
      path.join(
        DIST_DIR,
        '404.html',
      );

    try {
      await sendFile(
        request,
        response,
        filePath,
        404,
      );
    } catch {
      const message =
        '404 - Página não encontrada';

      response.writeHead(
        404,
        {
          'Content-Type':
            'text/plain; charset=utf-8',

          'Content-Length':
            Buffer.byteLength(
              message,
            ),
        },
      );

      if (
        request.method ===
        'HEAD'
      ) {
        response.end();
        return;
      }

      response.end(
        message,
      );
    }
  };

const getClientIp = (
  request: IncomingMessage,
) => {
  const forwardedFor =
    request.headers[
      'x-forwarded-for'
    ];

  if (
    typeof forwardedFor ===
    'string'
  ) {
    const firstIp =
      forwardedFor
        .split(',')[0]
        ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  if (
    Array.isArray(
      forwardedFor,
    )
  ) {
    const firstIp =
      forwardedFor[0]
        ?.split(',')[0]
        ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return (
    request.socket
      .remoteAddress ??
    'unknown'
  );
};

const checkContactRateLimit = (
  clientIp: string,
) => {
  const now =
    Date.now();

  const current =
    contactRateLimits.get(
      clientIp,
    );

  if (
    !current ||
    now >= current.resetAt
  ) {
    contactRateLimits.set(
      clientIp,
      {
        count: 1,

        resetAt:
          now +
          CONTACT_RATE_LIMIT_WINDOW_MS,
      },
    );

    return {
      allowed: true,
      retryAfter: 0,
    };
  }

  if (
    current.count >=
    CONTACT_RATE_LIMIT_MAX
  ) {
    return {
      allowed: false,

      retryAfter:
        Math.ceil(
          (
            current.resetAt -
            now
          ) / 1000,
        ),
    };
  }

  current.count += 1;

  contactRateLimits.set(
    clientIp,
    current,
  );

  return {
    allowed: true,
    retryAfter: 0,
  };
};

const server =
  createServer(
    async (
      request,
      response,
    ) => {
      setSecurityHeaders(
        response,
      );

      try {
        const url =
          new URL(
            request.url ?? '/',
            'http://localhost',
          );

        const pathname =
          decodeURIComponent(
            url.pathname,
          );

        /*
         * CONTACT API
         */
        if (
          pathname ===
          '/api/contact'
        ) {
          if (
            request.method !==
            'POST'
          ) {
            response.setHeader(
              'Allow',
              'POST',
            );

            sendJson(
              request,
              response,
              405,
              {
                error:
                  'Method not allowed',
              },
            );

            return;
          }

          const contentType =
            request.headers[
              'content-type'
            ] ?? '';

          if (
            !contentType
              .toLowerCase()
              .startsWith(
                'application/json',
              )
          ) {
            sendJson(
              request,
              response,
              415,
              {
                error:
                  'Content-Type must be application/json',
              },
            );

            return;
          }

          const clientIp =
            getClientIp(
              request,
            );

          const rateLimit =
            checkContactRateLimit(
              clientIp,
            );

          if (
            !rateLimit.allowed
          ) {
            response.setHeader(
              'Retry-After',
              String(
                rateLimit.retryAfter,
              ),
            );

            sendJson(
              request,
              response,
              429,
              {
                error:
                  'Too many requests',
              },
            );

            return;
          }

          try {
            const body =
              await readJsonBody(
                request,
              );

            const result =
              await processContactRequest(
                body,
              );

            sendJson(
              request,
              response,
              result.status,
              result.body,
            );
          } catch (error) {
            if (
              error instanceof
                Error &&
              error.message ===
                'BODY_TOO_LARGE'
            ) {
              sendJson(
                request,
                response,
                413,
                {
                  error:
                    'Request body too large',
                },
              );

              return;
            }

            console.error(
              'Contact API error:',
              error,
            );

            sendJson(
              request,
              response,
              400,
              {
                error:
                  'Invalid request',
              },
            );
          }

          return;
        }

        /*
         * SITE REQUESTS
         */
        if (
          request.method !==
            'GET' &&
          request.method !==
            'HEAD'
        ) {
          sendJson(
            request,
            response,
            405,
            {
              error:
                'Method not allowed',
            },
          );

          return;
        }

        /*
         * HOME
         */
        if (
          pathname === '/' ||
          pathname === ''
        ) {
          await sendFile(
            request,
            response,
            path.join(
              DIST_DIR,
              'index.html',
            ),
          );

          return;
        }

        /*
         * SERVICES
         */
        if (
          pathname ===
            '/servicos' ||
          pathname ===
            '/servicos/'
        ) {
          await sendFile(
            request,
            response,
            path.join(
              DIST_DIR,
              'servicos',
              'index.html',
            ),
          );

          return;
        }

        /*
         * PRIVACY
         */
        if (
          pathname ===
            '/privacidade' ||
          pathname ===
            '/privacidade/'
        ) {
          await sendFile(
            request,
            response,
            path.join(
              DIST_DIR,
              'privacidade',
              'index.html',
            ),
          );

          return;
        }

        /*
         * STATIC FILES
         */
        const relativePath =
          pathname.replace(
            /^\/+/,
            '',
          );

        const filePath =
          path.resolve(
            DIST_DIR,
            relativePath,
          );

        /*
         * Prevent path traversal.
         */
        if (
          !filePath.startsWith(
            `${DIST_DIR}${path.sep}`,
          )
        ) {
          await serve404(
            request,
            response,
          );

          return;
        }

        try {
          const fileStat =
            await stat(
              filePath,
            );

          if (
            fileStat.isFile()
          ) {
            await sendFile(
              request,
              response,
              filePath,
            );

            return;
          }
        } catch {
          // File does not exist.
        }

        /*
         * Unknown routes are real 404s.
         */
        await serve404(
          request,
          response,
        );
      } catch (error) {
        console.error(
          'Server error:',
          error,
        );

        const message =
          'Internal server error';

        response.writeHead(
          500,
          {
            'Content-Type':
              'text/plain; charset=utf-8',

            'Content-Length':
              Buffer.byteLength(
                message,
              ),
          },
        );

        if (
          request.method ===
          'HEAD'
        ) {
          response.end();
          return;
        }

        response.end(
          message,
        );
      }
    },
  );

server.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `AXION website running on port ${PORT}`,
    );
  },
);
