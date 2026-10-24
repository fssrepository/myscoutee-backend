import {
  assert,
  expectArray,
  expectObject,
  expectString
} from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { resolveResourceUrl } from '@fssrepository/myscoutee-e2e/shared/http.mjs';

export const SEEDED_ARTICLE_CONTENT_KEYS = Object.freeze([
  'idea-host-use-case',
  'idea-register-value',
  'idea-social-first-dating',
  'idea-trust-context',
  'idea-why-priority-matching'
]);

const ARTICLE_IMAGE_VARIANTS = Object.freeze(['small', 'medium', 'large']);
const PLACEHOLDER_IMAGE_FRAGMENTS = Object.freeze([
  'assets/logo/heart.webp',
  'assets/logo/heart.png',
  'assets/idea/article-fallback.svg'
]);

export function assertSeededArticleImages(records, path = 'landing articles') {
  const articles = expectArray(records, path);
  const imagesByContentKey = new Map();

  articles.forEach((article, index) => {
    const articlePath = `${path}[${index}]`;
    const contentKey = expectString(article?.contentKey, `${articlePath}.contentKey`).trim();
    const largeUrl = expectString(article?.imageUrl, `${articlePath}.imageUrl`).trim();
    const imageUrls = expectArray(article?.imageUrls, `${articlePath}.imageUrls`);

    assertNoPlaceholder(largeUrl, `${articlePath}.imageUrl`);
    imageUrls.forEach((imageUrl, imageIndex) => {
      assertNoPlaceholder(
        expectString(imageUrl, `${articlePath}.imageUrls[${imageIndex}]`),
        `${articlePath}.imageUrls[${imageIndex}]`
      );
    });
    assertNoPlaceholder(`${article?.contentHtml ?? ''}`, `${articlePath}.contentHtml`);
    assert(
      imageUrls.includes(largeUrl),
      `${articlePath}.imageUrls should contain its primary imageUrl`,
      { contentKey, largeUrl, imageUrls }
    );
    assert(
      `${article?.contentHtml ?? ''}`.includes(largeUrl),
      `${articlePath}.contentHtml should embed its primary imageUrl for the article detail popup`,
      { contentKey, largeUrl }
    );

    const objectKey = publicMediaObjectKey(largeUrl, `${articlePath}.imageUrl`);
    const expectedObjectKey = seededArticleObjectKey(contentKey, 'large');
    assert(
      objectKey === expectedObjectKey,
      `${articlePath}.imageUrl should use the stable seeded large WebP`,
      { contentKey, expectedObjectKey, objectKey, largeUrl }
    );
    assert(
      !imagesByContentKey.has(contentKey),
      `${path} should contain one image per contentKey`,
      { contentKey }
    );
    imagesByContentKey.set(contentKey, { contentKey, largeUrl, objectKey });
  });

  const actualContentKeys = [...imagesByContentKey.keys()].sort();
  assert(
    actualContentKeys.length === SEEDED_ARTICLE_CONTENT_KEYS.length
      && actualContentKeys.every((contentKey, index) => contentKey === SEEDED_ARTICLE_CONTENT_KEYS[index]),
    `${path} should expose the five seeded contextual article images`,
    {
      expectedContentKeys: SEEDED_ARTICLE_CONTENT_KEYS,
      actualContentKeys
    }
  );

  return SEEDED_ARTICLE_CONTENT_KEYS.map(contentKey => imagesByContentKey.get(contentKey));
}

export async function loadSeededArticleImages(ctx) {
  const imagesByLanguage = new Map();
  for (const lang of ['en', 'hu']) {
    const result = await ctx.http.get('/api/landing/articles', {
      params: {
        lang,
        page: '0',
        pageSize: '10'
      },
      expectedStatus: 200,
      timeoutMs: Number(process.env.E2E_IMAGE_TIMEOUT_MS ?? 10000)
    });
    const responsePath = `seeded ${lang} landing articles page`;
    const response = expectObject(result.data, responsePath);
    const records = expectArray(response.records, `${responsePath}.records`);
    records.forEach((article, index) => {
      assert(
        expectString(article?.lang, `${responsePath}.records[${index}].lang`) === lang,
        `${responsePath} should only contain the requested language`,
        article
      );
    });
    assert(
      Number(response.total) === SEEDED_ARTICLE_CONTENT_KEYS.length,
      `${responsePath}.total should match the five seeded articles`,
      { total: response.total }
    );
    assert(
      !`${response.nextCursor ?? ''}`.trim(),
      `${responsePath} should fit on one page`,
      { nextCursor: response.nextCursor }
    );
    imagesByLanguage.set(
      lang,
      assertSeededArticleImages(records, `${responsePath}.records`)
    );
  }

  const englishImages = imagesByLanguage.get('en');
  const hungarianImages = imagesByLanguage.get('hu');
  englishImages.forEach((englishImage, index) => {
    const hungarianImage = hungarianImages[index];
    assert(
      hungarianImage?.contentKey === englishImage.contentKey
        && hungarianImage.objectKey === englishImage.objectKey
        && hungarianImage.largeUrl === englishImage.largeUrl,
      'English and Hungarian article pairs should share the same contextual image family',
      { englishImage, hungarianImage }
    );
  });
  return englishImages;
}

export async function assertSeededArticleImageVariants(ctx, imageSets) {
  const seededImages = expectArray(imageSets, 'seeded article images');
  assert(
    seededImages.length === SEEDED_ARTICLE_CONTENT_KEYS.length,
    'seeded article images should contain five contentKey image sets',
    { count: seededImages.length }
  );

  const checkedUrls = [];
  for (const imageSetValue of seededImages) {
    const imageSet = expectObject(imageSetValue, 'seeded article image');
    const contentKey = expectString(imageSet.contentKey, 'seeded article image.contentKey').trim();
    const largeUrl = expectString(imageSet.largeUrl, 'seeded article image.largeUrl').trim();
    const objectKey = expectString(imageSet.objectKey, 'seeded article image.objectKey').trim();
    assert(
      objectKey === seededArticleObjectKey(contentKey, 'large'),
      'seeded article image should retain its stable large object key',
      { contentKey, objectKey }
    );

    const resolvedLargeUrl = resolveResourceUrl(ctx.http.baseUrl, largeUrl);
    assert(resolvedLargeUrl, 'seeded article image URL should resolve locally', {
      contentKey,
      largeUrl
    });
    for (const variant of ARTICLE_IMAGE_VARIANTS) {
      const variantUrl = new URL(resolvedLargeUrl);
      variantUrl.searchParams.set('key', seededArticleObjectKey(contentKey, variant));
      const result = await ctx.http.get(variantUrl.toString(), {
        expectedStatus: 200,
        headers: { Accept: 'image/webp' },
        timeoutMs: Number(process.env.E2E_IMAGE_TIMEOUT_MS ?? 10000)
      });
      const contentType = `${result.headers['content-type'] ?? ''}`
        .split(';', 1)[0]
        .trim()
        .toLowerCase();
      assert(result.status === 200, `seeded article ${variant} image should return HTTP 200`, {
        contentKey,
        status: result.status,
        url: variantUrl.toString()
      });
      assert(contentType === 'image/webp', `seeded article ${variant} image should return image/webp`, {
        contentKey,
        contentType,
        url: variantUrl.toString()
      });
      checkedUrls.push(variantUrl.toString());
    }
  }

  assert(
    new Set(checkedUrls).size === SEEDED_ARTICLE_CONTENT_KEYS.length * ARTICLE_IMAGE_VARIANTS.length,
    'seeded article media check should cover 15 distinct variant URLs',
    { checkedUrls }
  );
  return checkedUrls;
}

function seededArticleObjectKey(contentKey, variant) {
  return `images/system/idea-posts/${contentKey}/v1/${variant}.webp`;
}

function publicMediaObjectKey(value, path) {
  let url;
  try {
    url = new URL(value, 'https://e2e.invalid');
  } catch {
    assert(false, `${path} should be a valid media URL`, { value });
  }
  assert(
    url.pathname === '/media/public' || url.pathname === '/api/media/public',
    `${path} should use the public media endpoint`,
    { value, pathname: url.pathname }
  );
  return expectString(url.searchParams.get('key'), `${path} key`).trim();
}

function assertNoPlaceholder(value, path) {
  const normalized = `${value ?? ''}`.toLowerCase();
  const placeholder = PLACEHOLDER_IMAGE_FRAGMENTS.find(fragment => normalized.includes(fragment));
  assert(!placeholder, `${path} should not use a generic article placeholder`, {
    placeholder,
    value
  });
}
