Promotional email seed data for MongoDB lives here.

Recommended import commands:

```bash
mongoimport \
  --db "$MONGODB_DATABASE" \
  --collection emailTemplates \
  --jsonArray \
  --mode=upsert \
  --upsertFields=templateKey \
  --file server/projects/profile/src/main/resources/mongo-seed/profile/emailTemplates.json

mongoimport \
  --db "$MONGODB_DATABASE" \
  --collection emailCampaignRules \
  --jsonArray \
  --mode=upsert \
  --upsertFields=ruleKey \
  --file server/projects/profile/src/main/resources/mongo-seed/profile/emailCampaignRules.json

mongoimport \
  --db "$MONGODB_DATABASE" \
  --collection notificationTemplates \
  --jsonArray \
  --mode=upsert \
  --upsertFields=templateKey \
  --file server/projects/profile/src/main/resources/mongo-seed/profile/notificationTemplates.json

mongoimport \
  --db "$MONGODB_DATABASE" \
  --collection scheduledMessageTasks \
  --jsonArray \
  --mode=upsert \
  --upsertFields=taskKey \
  --file server/projects/profile/src/main/resources/mongo-seed/profile/scheduledMessageTasks.json
```

Template placeholders can use either `{{firstName}}` style tokens or `@user_first_name` style tokens.

Common built-in variables:

- `@user_name`
- `@user_first_name`
- `@user_email`
- `@user_city`
- `@user_country_code`
- `@user_country_name`
- `@completion_percent`
- `@cta_url`
- `@cta_label`
- `@campaign_rule_key`

Rule-level `templateVariables` override or extend the built-in values.
