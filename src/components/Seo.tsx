import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
}

const setMeta = (
  selector: string,
  attributes: Record<string, string>,
) => {
  let element =
    document.head.querySelector<HTMLMetaElement>(
      selector,
    );

  if (!element) {
    element =
      document.createElement('meta');

    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(
    ([name, value]) => {
      element!.setAttribute(
        name,
        value,
      );
    },
  );
};

export default function Seo({
  title,
  description,
  canonical,
  robots = 'index, follow',
}: SeoProps) {
  useEffect(() => {
    document.title = title;

    setMeta(
      'meta[name="description"]',
      {
        name: 'description',
        content: description,
      },
    );

    setMeta(
      'meta[name="robots"]',
      {
        name: 'robots',
        content: robots,
      },
    );

    setMeta(
      'meta[property="og:title"]',
      {
        property: 'og:title',
        content: title,
      },
    );

    setMeta(
      'meta[property="og:description"]',
      {
        property:
          'og:description',
        content: description,
      },
    );

    setMeta(
      'meta[property="og:type"]',
      {
        property: 'og:type',
        content: 'website',
      },
    );

    setMeta(
      'meta[name="twitter:card"]',
      {
        name: 'twitter:card',
        content:
          'summary_large_image',
      },
    );

    setMeta(
      'meta[name="twitter:title"]',
      {
        name: 'twitter:title',
        content: title,
      },
    );

    setMeta(
      'meta[name="twitter:description"]',
      {
        name: 'twitter:description',
        content: description,
      },
    );

    if (canonical) {
      let canonicalElement =
        document.head.querySelector<HTMLLinkElement>(
          'link[rel="canonical"]',
        );

      if (!canonicalElement) {
        canonicalElement =
          document.createElement(
            'link',
          );

        canonicalElement.rel =
          'canonical';

        document.head.appendChild(
          canonicalElement,
        );
      }

      canonicalElement.href =
        canonical;

      setMeta(
        'meta[property="og:url"]',
        {
          property: 'og:url',
          content: canonical,
        },
      );
    }
  }, [
    title,
    description,
    canonical,
    robots,
  ]);

  return null;
}