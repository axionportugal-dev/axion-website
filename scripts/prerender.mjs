import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const ssrEntry = path.join(
  rootDir,
  '.ssr',
  'entry-server.js',
);

const {
  render,
  prerenderRoutes,
  getSeoForPath,
} = await import(
  pathToFileURL(ssrEntry).href
);

const templatePath =
  path.join(distDir, 'index.html');

const template =
  await fs.readFile(
    templatePath,
    'utf8',
  );

const managedMeta = new Set([
  'description',
  'robots',
  'og:title',
  'og:description',
  'og:type',
  'og:locale',
  'twitter:card',
  'twitter:title',
  'twitter:description',
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cleanManagedHead(html) {
  html = html.replace(
    /<title\b[^>]*>[\s\S]*?<\/title>\s*/gi,
    '',
  );

  html = html.replace(
    /<meta\b[^>]*>\s*/gi,
    (tag) => {
      const match = tag.match(
        /\b(?:name|property)=["']([^"']+)["']/i,
      );

      const key =
        match?.[1]?.toLowerCase();

      if (
        key &&
        managedMeta.has(key)
      ) {
        return '';
      }

      return tag;
    },
  );

  return html;
}

function setLanguage(html) {
  if (
    /<html\b[^>]*\blang=/i.test(
      html,
    )
  ) {
    return html.replace(
      /\blang=(["'])[^"']*\1/i,
      'lang="pt-PT"',
    );
  }

  return html.replace(
    /<html\b([^>]*)>/i,
    '<html$1 lang="pt-PT">',
  );
}

function buildHead(seo) {
  const title =
    escapeHtml(seo.title);

  const description =
    escapeHtml(
      seo.description,
    );

  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">

    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="pt_PT">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  `;
}

for (const route of prerenderRoutes) {
  const appHtml =
    render(route);

  const seo =
    getSeoForPath(route);

  let page =
    cleanManagedHead(template);

  page =
    setLanguage(page);

  page = page.replace(
    '</head>',
    `${buildHead(seo)}
</head>`,
  );

  const rootPattern =
    /<div\s+id=["']root["']\s*>\s*<\/div>/i;

  if (!rootPattern.test(page)) {
    throw new Error(
      'Não foi encontrado <div id="root"></div> em dist/index.html',
    );
  }

  page = page.replace(
    rootPattern,
    `<div id="root">${appHtml}</div>`,
  );

  const outputPath =
    route === '/'
      ? path.join(
          distDir,
          'index.html',
        )
      : path.join(
          distDir,
          route.slice(1),
          'index.html',
        );

  await fs.mkdir(
    path.dirname(outputPath),
    {
      recursive: true,
    },
  );

  await fs.writeFile(
    outputPath,
    page,
    'utf8',
  );

  console.log(
    `✓ Prerendered ${route}`,
  );
}

console.log(
  `✓ Prerendered ${prerenderRoutes.length} pages`,
);
