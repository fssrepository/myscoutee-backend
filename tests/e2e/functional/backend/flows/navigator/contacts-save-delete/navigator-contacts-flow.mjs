import { assert, expectArray } from '@fssrepository/myscoutee-e2e/shared/assertions.mjs';

export async function assertResponse({ ctx, result, request }) {
  const savedContacts = expectArray(result.data, 'save contacts response');
  assert(savedContacts.length === 1, 'Saving one contact should return one contact', savedContacts);
  const savedContact = savedContacts[0];
  assert(savedContact.id === request.body.contacts[0].id, 'Saved contact id should round trip', savedContact);
  assert(savedContact.methods?.length === 2, 'Saved contact should keep contact detail methods', savedContact);

  const loaded = await ctx.http.get('/api/navigator/contacts', {
    params: { userId: ctx.vars.e2eUserId },
    headers: request.headers,
    expectedStatus: 200
  });
  const loadedContacts = expectArray(loaded.data, 'load contacts response');
  assert(
    loadedContacts.some(contact => contact.id === savedContact.id),
    'Loaded contacts should include the saved contact',
    loadedContacts
  );

  const profileAfterSave = await ctx.http.get('/api/auth/me', {
    params: { userId: ctx.vars.e2eUserId },
    headers: request.headers,
    expectedStatus: 200
  });
  assert(
    Number(profileAfterSave.data?.activities?.contacts) === 1,
    'Saving contacts should update the user contacts counter',
    profileAfterSave.data?.activities
  );

  const afterDelete = await ctx.http.request('DELETE', `/api/navigator/contacts/${encodeURIComponent(savedContact.id)}`, {
    headers: request.headers,
    json: { userId: ctx.vars.e2eUserId },
    expectedStatus: 200
  });
  const remainingContacts = expectArray(afterDelete.data, 'delete contacts response');
  assert(
    !remainingContacts.some(contact => contact.id === savedContact.id),
    'Deleted contact should not be returned after delete',
    remainingContacts
  );

  const profileAfterDelete = await ctx.http.get('/api/auth/me', {
    params: { userId: ctx.vars.e2eUserId },
    headers: request.headers,
    expectedStatus: 200
  });
  assert(
    Number(profileAfterDelete.data?.activities?.contacts) === 0,
    'Deleting contacts should update the user contacts counter',
    profileAfterDelete.data?.activities
  );
}
