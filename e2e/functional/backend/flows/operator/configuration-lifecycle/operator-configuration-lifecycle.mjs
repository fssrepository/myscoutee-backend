import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  assert,
  expectArray,
  expectBoolean,
  expectKeys,
  expectObject,
  expectString
} from '../../../../../shared/assertions.mjs';
import {
  assertNoWriteOnlyConfiguration,
  assertOperatorConfiguration
} from '../../../lib/operator-contracts.mjs';

export async function assertResponse({ ctx, result, request }) {
  const original = assertOperatorConfiguration(
    result.data,
    'original operator configuration'
  );
  const baselineAdminEmails = await loadSeedAdminEmails(original.adminEmails);
  assert(
    original.payment.credentialConfigured === false,
    'configuration lifecycle requires the credential-free e2e seed',
    original.payment
  );

  const runSlug = `${ctx.vars.runId}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 36);
  const stripeSecret = `sk_e2e_${runSlug}_stripe_7x9q`;
  const barionSecret = `barion-e2e-${runSlug}-4m2z`;
  const e2eAdminEmail = `operator-e2e+${runSlug}@example.test`;
  const e2eSocialUrl = `https://community.example.test/operator/${runSlug}`;
  const e2eSocialProvider = `E2E-${runSlug}`.slice(0, 32);
  const managedLogoUrl = `/media/public?key=images%2Foperator-e2e-${runSlug}%2Fbranding%2Fmedium`;
  const publicBaseUrl = `https://payments.example.test/operator/${runSlug}`;
  const originalPayload = toUpdatePayload(original, baselineAdminEmails);
  const e2eSocialLink = {
    provider: e2eSocialProvider,
    label: 'E2E community',
    url: e2eSocialUrl,
    icon: 'groups',
    handle: `@${runSlug}`.slice(0, 80)
  };
  const changedPayload = {
    ...originalPayload,
    adminEmails: [
      ...baselineAdminEmails,
      e2eAdminEmail.toUpperCase(),
      e2eAdminEmail
    ],
    privacyContact: {
      dataControllerName: `E2E Operator ${runSlug}`,
      privacyContactEmail: `PRIVACY+${runSlug}@EXAMPLE.TEST`
    },
    socialLinks: [
      ...original.socialLinks,
      e2eSocialLink,
      { ...e2eSocialLink }
    ],
    branding: {
      ...originalPayload.branding,
      productName: `E2E Operator ${runSlug}`.slice(0, 80),
      logoCharacterIndex: 0,
      logoUrl: managedLogoUrl,
      themePreset: alternateTheme(original.branding.themePreset)
    },
    payment: {
      providerId: 'stripe',
      publicBaseUrl: `${publicBaseUrl}///`,
      merchantAccount: `stripe-${runSlug}`,
      credential: stripeSecret
    }
  };

  let shouldRestore = false;
  try {
    shouldRestore = true;
    const saved = await putConfiguration(ctx, request.headers, changedPayload, 200);
    const changed = assertOperatorConfiguration(
      saved.data,
      'saved operator configuration',
      { forbiddenValues: [stripeSecret] }
    );
    assertChangedConfiguration(changed, {
      original,
      changedPayload,
      e2eAdminEmail,
      e2eSocialUrl,
      e2eSocialProvider: e2eSocialProvider.toLowerCase(),
      managedLogoUrl,
      baselineAdminCount: baselineAdminEmails.length,
      originalSocialLinkCount: original.socialLinks.length,
      publicBaseUrl,
      expectedProvider: 'stripe',
      expectedMerchantAccount: `stripe-${runSlug}`,
      expectedMaskSuffix: '7x9q'
    });

    const reloadedResult = await ctx.http.get(request.path, {
      headers: request.headers,
      expectedStatus: 200
    });
    const reloaded = assertOperatorConfiguration(
      reloadedResult.data,
      'reloaded operator configuration',
      { forbiddenValues: [stripeSecret] }
    );
    assertConfigurationProjection(reloaded, changed, 'reloaded operator configuration');
    await assertPublicProjection(ctx, changed);

    const normalizedPayload = toUpdatePayload(changed, changed.adminEmails);
    const retainedRoutingUrl = `${publicBaseUrl}/retained`;
    const retainedPayload = mergeUpdate(normalizedPayload, {
      payment: {
        providerId: 'stripe',
        publicBaseUrl: `${retainedRoutingUrl}///`,
        merchantAccount: `stripe-retained-${runSlug}`,
        credential: ''
      }
    });
    const retainedResult = await putConfiguration(
      ctx,
      request.headers,
      retainedPayload,
      200
    );
    const retained = assertOperatorConfiguration(
      retainedResult.data,
      'same-provider credential retention',
      { forbiddenValues: [stripeSecret] }
    );
    assert(
      retained.payment.providerId === 'stripe'
        && retained.payment.publicBaseUrl === retainedRoutingUrl
        && retained.payment.merchantAccount === `stripe-retained-${runSlug}`
        && retained.payment.credentialConfigured === true
        && retained.payment.credentialMask === '••••7x9q',
      'updating routing metadata without a new same-provider secret should retain the credential',
      retained.payment
    );

    const validationCases = [
      {
        name: 'payment credential without a selected provider',
        secret: `providerless-${runSlug}-1a2b`,
        patch: {
          payment: {
            providerId: null,
            publicBaseUrl,
            merchantAccount: null,
            credential: `providerless-${runSlug}-1a2b`
          }
        }
      },
      {
        name: 'payment credential without a public deployment URL',
        secret: `missing-url-${runSlug}-2b3c`,
        patch: {
          payment: {
            providerId: 'stripe',
            publicBaseUrl: '',
            merchantAccount: `stripe-${runSlug}`,
            credential: `missing-url-${runSlug}-2b3c`
          }
        }
      },
      {
        name: 'non-loopback HTTP payment URL',
        secret: `http-url-${runSlug}-3c4d`,
        patch: {
          payment: {
            providerId: 'stripe',
            publicBaseUrl: 'http://payments.example.test',
            merchantAccount: `stripe-${runSlug}`,
            credential: `http-url-${runSlug}-3c4d`
          }
        }
      },
      {
        name: 'payment URL with a query string',
        secret: `query-url-${runSlug}-4d5e`,
        patch: {
          payment: {
            providerId: 'stripe',
            publicBaseUrl: `${publicBaseUrl}?token=must-not-be-accepted`,
            merchantAccount: `stripe-${runSlug}`,
            credential: `query-url-${runSlug}-4d5e`
          }
        }
      },
      {
        name: 'payment URL with path traversal',
        secret: `path-url-${runSlug}-4e5f`,
        patch: {
          payment: {
            providerId: 'stripe',
            publicBaseUrl: `${publicBaseUrl}/../admin`,
            merchantAccount: `stripe-${runSlug}`,
            credential: `path-url-${runSlug}-4e5f`
          }
        }
      },
      {
        name: 'Barion credential without merchant account',
        secret: `barion-account-${runSlug}-5e6f`,
        patch: {
          payment: {
            providerId: 'barion',
            publicBaseUrl,
            merchantAccount: '',
            credential: `barion-account-${runSlug}-5e6f`
          }
        }
      },
      {
        name: 'Barion credential with malformed merchant account',
        secret: `barion-email-${runSlug}-6f7g`,
        patch: {
          payment: {
            providerId: 'barion',
            publicBaseUrl,
            merchantAccount: 'not-an-email',
            credential: `barion-email-${runSlug}-6f7g`
          }
        }
      },
      {
        name: 'unsupported payment provider',
        secret: `unknown-provider-${runSlug}-7g8h`,
        patch: {
          payment: {
            providerId: 'unknown-provider',
            publicBaseUrl,
            merchantAccount: null,
            credential: `unknown-provider-${runSlug}-7g8h`
          }
        }
      },
      {
        name: 'invalid administrator e-mail',
        patch: {
          adminEmails: ['not-an-email']
        }
      },
      {
        name: 'too many administrator e-mails',
        patch: {
          adminEmails: Array.from(
            { length: 33 },
            (_value, index) => `operator-${index}@example.test`
          )
        }
      },
      {
        name: 'partial privacy contact',
        patch: {
          privacyContact: {
            dataControllerName: `E2E Operator ${runSlug}`,
            privacyContactEmail: ''
          }
        }
      },
      {
        name: 'malformed privacy contact e-mail',
        patch: {
          privacyContact: {
            dataControllerName: `E2E Operator ${runSlug}`,
            privacyContactEmail: 'not-an-email'
          }
        }
      },
      {
        name: 'blank product name',
        patch: {
          branding: {
            productName: ' '
          }
        }
      },
      {
        name: 'out-of-range logo character index',
        patch: {
          branding: {
            logoCharacterIndex: 9999
          }
        }
      },
      {
        name: 'external branding logo URL',
        patch: {
          branding: {
            logoUrl: `https://images.example.test/${runSlug}.png`
          }
        }
      },
      {
        name: 'unsupported branding theme',
        patch: {
          branding: {
            themePreset: 'NEON'
          }
        }
      },
      {
        name: 'invalid social provider identifier',
        patch: {
          socialLinks: retainedPayload.socialLinks.map((link, index) => index === 0
            ? { ...link, provider: 'not valid' }
            : { ...link })
        }
      },
      {
        name: 'insecure social URL',
        patch: {
          socialLinks: retainedPayload.socialLinks.map((link, index) => index === 0
            ? { ...link, url: `http://community.example.test/${runSlug}` }
            : { ...link })
        }
      },
      {
        name: 'duplicate social URL under another provider',
        patch: {
          socialLinks: [
            ...retainedPayload.socialLinks,
            {
              ...retainedPayload.socialLinks[0],
              provider: `duplicate-${runSlug}`.slice(0, 32)
            }
          ]
        }
      },
      {
        name: 'Firebase auth domain with a scheme',
        patch: {
          firebase: {
            authDomain: 'https://firebase.example.test'
          }
        }
      },
      {
        name: 'duplicate social provider',
        patch: {
          socialLinks: [
            ...retainedPayload.socialLinks,
            {
              ...retainedPayload.socialLinks[0],
              url: `https://duplicate.example.test/${runSlug}`
            }
          ]
        }
      }
    ];

    for (const validationCase of validationCases) {
      const rejectedPayload = mergeUpdate(retainedPayload, validationCase.patch);
      const rejected = await putConfiguration(ctx, request.headers, rejectedPayload, 400);
      assert(
        rejected.status === 400,
        `${validationCase.name} should be rejected without persisting`,
        rejected.data
      );
      assertNoWriteOnlyConfiguration(
        rejected.data,
        `${validationCase.name} error response`,
        validationCase.secret ? [validationCase.secret] : []
      );
    }

    const afterValidationResult = await ctx.http.get(request.path, {
      headers: request.headers,
      expectedStatus: 200
    });
    const afterValidation = assertOperatorConfiguration(
      afterValidationResult.data,
      'configuration after rejected updates',
      {
        forbiddenValues: [
          stripeSecret,
          ...validationCases.map(entry => entry.secret).filter(Boolean)
        ]
      }
    );
    assertConfigurationProjection(
      afterValidation,
      retained,
      'configuration after rejected updates'
    );

    const loopbackSecret = `loopback-${runSlug}-8h9j`;
    const loopbackPayload = mergeUpdate(retainedPayload, {
      payment: {
        providerId: 'stripe',
        publicBaseUrl: `http://127.0.0.1:8080/operator/${runSlug}///`,
        merchantAccount: `stripe-${runSlug}`,
        credential: loopbackSecret
      }
    });
    const loopbackResult = await putConfiguration(
      ctx,
      request.headers,
      loopbackPayload,
      200
    );
    const loopback = assertOperatorConfiguration(
      loopbackResult.data,
      'loopback payment configuration',
      { forbiddenValues: [stripeSecret, loopbackSecret] }
    );
    assert(
      loopback.payment.publicBaseUrl
        === `http://127.0.0.1:8080/operator/${runSlug}`,
      'loopback HTTP payment URL should be accepted and normalized',
      loopback.payment
    );
    assert(
      loopback.payment.credentialConfigured
        && loopback.payment.credentialMask === '••••8h9j',
      'loopback payment credential should remain write-only',
      loopback.payment
    );

    const barionPayload = mergeUpdate(retainedPayload, {
      payment: {
        providerId: 'barion',
        publicBaseUrl: `${publicBaseUrl}/barion/`,
        merchantAccount: `merchant+${runSlug}@example.test`,
        credential: barionSecret
      }
    });
    const barionResult = await putConfiguration(ctx, request.headers, barionPayload, 200);
    const barion = assertOperatorConfiguration(
      barionResult.data,
      'Barion operator configuration',
      { forbiddenValues: [stripeSecret, loopbackSecret, barionSecret] }
    );
    assert(barion.payment.providerId === 'barion', 'Barion should become the selected provider');
    assert(
      barion.payment.publicBaseUrl === `${publicBaseUrl}/barion`,
      'Barion public base URL should be normalized'
    );
    assert(
      barion.payment.merchantAccount === `merchant+${runSlug}@example.test`,
      'Barion merchant account should be persisted'
    );
    assert(barion.payment.credentialConfigured === true, 'Barion credential should be configured');
    assert(barion.payment.credentialMask === '••••4m2z', 'Barion credential should expose only its suffix');

    const switchedWithoutSecretPayload = mergeUpdate(retainedPayload, {
      payment: {
        providerId: 'stripe',
        publicBaseUrl,
        merchantAccount: `stripe-${runSlug}`,
        credential: ''
      }
    });
    const switchedResult = await putConfiguration(
      ctx,
      request.headers,
      switchedWithoutSecretPayload,
      200
    );
    const switched = assertOperatorConfiguration(
      switchedResult.data,
      'provider switch without credential',
      { forbiddenValues: [stripeSecret, loopbackSecret, barionSecret] }
    );
    assert(switched.payment.providerId === 'stripe', 'provider switch should select Stripe');
    assert(
      switched.payment.credentialConfigured === false
        && switched.payment.credentialMask === null,
      'switching provider without a new secret should clear the previous credential',
      switched.payment
    );
  } finally {
    if (shouldRestore) {
      const restoredResult = await putConfiguration(
        ctx,
        request.headers,
        originalPayload,
        200
      );
      const restored = assertOperatorConfiguration(
        restoredResult.data,
        'restored operator configuration',
        { forbiddenValues: [stripeSecret, barionSecret, `loopback-${runSlug}-8h9j`] }
      );
      assertSemanticRestore(restored, original, baselineAdminEmails);
    }
  }
}

async function putConfiguration(ctx, headers, body, expectedStatus) {
  return ctx.http.request('PUT', '/api/operator/configuration', {
    headers,
    json: body,
    expectedStatus,
    timeoutMs: 12000
  });
}

function toUpdatePayload(configuration, adminEmails) {
  return {
    adminEmails: [...adminEmails],
    privacyContact: {
      dataControllerName: configuration.privacyContact.dataControllerName,
      privacyContactEmail: configuration.privacyContact.privacyContactEmail
    },
    socialLinks: configuration.socialLinks.map(link => ({ ...link })),
    branding: {
      productName: configuration.branding.productName,
      logoCharacterIndex: configuration.branding.logoCharacterIndex,
      homeLabel: configuration.branding.homeLabel,
      logoUrl: configuration.branding.logoUrl,
      themePreset: configuration.branding.themePreset
    },
    payment: {
      providerId: configuration.payment.providerId,
      publicBaseUrl: configuration.payment.publicBaseUrl,
      merchantAccount: configuration.payment.merchantAccount,
      credential: ''
    }
  };
}

function mergeUpdate(base, patch) {
  return {
    ...base,
    ...patch,
    branding: {
      ...base.branding,
      ...(patch.branding ?? {})
    },
    privacyContact: {
      ...base.privacyContact,
      ...(patch.privacyContact ?? {})
    },
    payment: {
      ...base.payment,
      ...(patch.payment ?? {})
    },
    socialLinks: patch.socialLinks ?? base.socialLinks.map(link => ({ ...link })),
    adminEmails: patch.adminEmails ?? [...base.adminEmails]
  };
}

function assertChangedConfiguration(configuration, expected) {
  assert(configuration.capability === 'AVAILABLE', 'saved configuration should remain available');
  assert(
    configuration.adminEmails.includes(expected.e2eAdminEmail.toLowerCase()),
    'saved configuration should include the normalized e2e administrator',
    configuration.adminEmails
  );
  assert(
    configuration.adminEmails.length === expected.baselineAdminCount + 1
      && configuration.adminEmails.filter(
        email => email === expected.e2eAdminEmail.toLowerCase()
      ).length === 1,
    'administrator e-mails should be case-normalized and deduplicated',
    configuration.adminEmails
  );
  assert(
    configuration.privacyContact.configured
      && configuration.privacyContact.dataControllerName
        === expected.changedPayload.privacyContact.dataControllerName
      && configuration.privacyContact.privacyContactEmail
        === expected.changedPayload.privacyContact.privacyContactEmail.toLowerCase(),
    'saved configuration should persist and normalize the privacy contact',
    configuration.privacyContact
  );
  const savedE2eLinks = configuration.socialLinks.filter(
    link => link.url === expected.e2eSocialUrl
  );
  assert(
    configuration.socialLinks.length === expected.originalSocialLinkCount + 1
      && savedE2eLinks.length === 1
      && savedE2eLinks[0].provider === expected.e2eSocialProvider,
    'social links should normalize provider case and collapse exact duplicates',
    configuration.socialLinks
  );
  assert(
    configuration.branding.productName === expected.changedPayload.branding.productName,
    'saved configuration should persist product branding',
    configuration.branding
  );
  assert(
    configuration.branding.themePreset === expected.changedPayload.branding.themePreset,
    'saved configuration should persist the theme preset',
    configuration.branding
  );
  assert(
    configuration.branding.logoUrl === expected.managedLogoUrl,
    'saved configuration should persist a managed media logo reference',
    configuration.branding
  );
  assert(
    configuration.branding.revision === expected.original.branding.revision + 1,
    'saved branding should advance its revision exactly once',
    configuration.branding
  );
  assert(
    configuration.payment.providerId === expected.expectedProvider
      && configuration.payment.publicBaseUrl === expected.publicBaseUrl
      && configuration.payment.merchantAccount === expected.expectedMerchantAccount,
    'saved payment routing metadata should be normalized and persisted',
    configuration.payment
  );
  assert(
    configuration.payment.credentialConfigured
      && configuration.payment.credentialMask === `••••${expected.expectedMaskSuffix}`,
    'saved payment credential should be exposed only as a suffix mask',
    configuration.payment
  );
}

function assertConfigurationProjection(actual, expected, path) {
  assert(actual.capability === expected.capability, `${path}.capability should remain stable`);
  assert(
    JSON.stringify(actual.adminEmails) === JSON.stringify(expected.adminEmails),
    `${path}.adminEmails should match the saved configuration`
  );
  assert(
    JSON.stringify(actual.privacyContact) === JSON.stringify(expected.privacyContact),
    `${path}.privacyContact should match the saved configuration`
  );
  assert(
    JSON.stringify(actual.socialLinks) === JSON.stringify(expected.socialLinks),
    `${path}.socialLinks should match the saved configuration`
  );
  assert(
    JSON.stringify(actual.branding) === JSON.stringify(expected.branding),
    `${path}.branding should match the saved configuration`
  );
  assert(
    JSON.stringify(actual.payment) === JSON.stringify(expected.payment),
    `${path}.payment should match the saved configuration`
  );
  assert(
    JSON.stringify(actual.firebase) === JSON.stringify(expected.firebase),
    `${path}.firebase should match the saved configuration`
  );
}

async function assertPublicProjection(ctx, operatorConfiguration) {
  const publicResult = await ctx.http.get('/api/deployment/configuration', {
    headers: {},
    expectedStatus: 200
  });
  const publicConfiguration = expectKeys(publicResult.data, [
    'productName',
    'logoCharacterIndex',
    'homeLabel',
    'logoUrl',
    'themePreset',
    'revision',
    'socialLinks',
    'privacyContact'
  ], 'public deployment configuration');
  assert(
    publicConfiguration.productName === operatorConfiguration.branding.productName
      && publicConfiguration.logoCharacterIndex === operatorConfiguration.branding.logoCharacterIndex
      && publicConfiguration.homeLabel === operatorConfiguration.branding.homeLabel
      && publicConfiguration.logoUrl === operatorConfiguration.branding.logoUrl
      && publicConfiguration.themePreset === operatorConfiguration.branding.themePreset
      && publicConfiguration.revision === operatorConfiguration.branding.revision,
    'public deployment configuration should project saved branding',
    publicConfiguration
  );
  assert(
    JSON.stringify(publicConfiguration.socialLinks) === JSON.stringify(operatorConfiguration.socialLinks),
    'public deployment configuration should project saved social links',
    publicConfiguration.socialLinks
  );
  const privacy = expectObject(publicConfiguration.privacyContact, 'public deployment privacy contact');
  expectBoolean(privacy.configured, 'public deployment privacy contact.configured');
  expectString(
    privacy.dataControllerName,
    'public deployment privacy contact.dataControllerName',
    { allowEmpty: true }
  );
  expectString(
    privacy.privacyContactEmail,
    'public deployment privacy contact.privacyContactEmail',
    { allowEmpty: true }
  );
  assert(
    JSON.stringify(privacy) === JSON.stringify(operatorConfiguration.privacyContact),
    'public deployment configuration should project saved privacy contact',
    privacy
  );
  for (const operatorOnlyField of [
    'capability',
    'unavailableReason',
    'adminEmails',
    'payment',
    'firebase',
    'updatedAt'
  ]) {
    assert(
      !Object.prototype.hasOwnProperty.call(publicConfiguration, operatorOnlyField),
      `public deployment configuration must not expose ${operatorOnlyField}`
    );
  }
  assertNoWriteOnlyConfiguration(publicConfiguration, 'public deployment configuration');
}

function assertSemanticRestore(restored, original, baselineAdminEmails) {
  assert(
    JSON.stringify(restored.adminEmails) === JSON.stringify(baselineAdminEmails),
    'restore should recover the authoritative e2e seed administrator list'
  );
  assert(
    JSON.stringify(restored.privacyContact) === JSON.stringify(original.privacyContact),
    'restore should recover the original privacy contact'
  );
  assert(
    JSON.stringify(restored.socialLinks) === JSON.stringify(original.socialLinks),
    'restore should recover the original social links'
  );
  for (const field of ['productName', 'logoCharacterIndex', 'homeLabel', 'logoUrl', 'themePreset']) {
    assert(
      restored.branding[field] === original.branding[field],
      `restore should recover original branding.${field}`
    );
  }
  for (const field of [
    'providerId',
    'publicBaseUrl',
    'merchantAccount',
    'credentialConfigured',
    'credentialMask'
  ]) {
    assert(
      restored.payment[field] === original.payment[field],
      `restore should recover original payment.${field}`,
      restored.payment
    );
  }
  assert(
    JSON.stringify(restored.firebase) === JSON.stringify(original.firebase),
    'restore should leave Firebase configuration unchanged'
  );
}

function alternateTheme(current) {
  return current === 'OCEAN' ? 'FOREST' : 'OCEAN';
}

async function loadSeedAdminEmails(currentAdminEmails) {
  if (
    process.env.E2E_RESET_COMMAND
      || process.env.E2E_SKIP_E2E_RESET === 'true'
  ) {
    return [...currentAdminEmails];
  }
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(currentDirectory, '../../../../../..');
  const seedRoot = path.join(
    repositoryRoot,
    'server',
    'docker',
    'conf',
    'mongodb'
  );
  const seedDirectory = process.env.E2E_SEED_DIRECTORY ?? 'e2e_db';
  const seedFile = path.resolve(seedRoot, seedDirectory, 'appSettings.json');
  assert(
    seedFile.startsWith(`${seedRoot}${path.sep}`),
    'E2E_SEED_DIRECTORY should identify a repository Mongo seed directory'
  );
  const records = JSON.parse(await readFile(seedFile, 'utf8'));
  const globalSettings = expectArray(records, 'e2e appSettings seed')
    .find(record => record?.settingsKey === 'global');
  const settings = expectObject(globalSettings, 'e2e global appSettings seed');
  const adminEmails = expectArray(
    settings.adminEmails,
    'e2e global appSettings seed.adminEmails'
  ).map((email, index) => expectString(
    email,
    `e2e global appSettings seed.adminEmails[${index}]`
  ).trim().toLowerCase());
  assert(
    adminEmails.length > 0 && new Set(adminEmails).size === adminEmails.length,
    'e2e global appSettings seed should provide unique administrator e-mails',
    adminEmails
  );
  return adminEmails;
}
