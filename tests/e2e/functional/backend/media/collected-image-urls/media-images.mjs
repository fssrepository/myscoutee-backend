import { assert } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';
import { assertReachableLocalImages } from '../../lib/contracts.mjs';

export async function assertResponse({ ctx }) {
  const checked = await assertReachableLocalImages(ctx, ctx.vars.imageUrls ?? []);
  if (process.env.E2E_REQUIRE_IMAGE_URLS === 'true') {
    assert(checked.length > 0, 'expected at least one local collected image URL to verify');
  }
  ctx.vars.checkedImageUrlCount = String(checked.length);
}
