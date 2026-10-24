import {
  assertSeededArticleImageVariants,
  loadSeededArticleImages
} from '../../lib/article-media.mjs';
import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function assertResponse({ ctx }) {
  const imageSets = await loadSeededArticleImages(ctx);
  const checkedUrls = await assertSeededArticleImageVariants(ctx, imageSets);
  assert(
    checkedUrls.length === 15,
    'the five seeded article image families should expose all 15 WebP variants',
    { checkedUrls }
  );
  ctx.vars.checkedArticleVariantUrlCount = String(checkedUrls.length);
}
