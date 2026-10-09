package com.raxim.myscoutee.domain.integrations.service;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
@Service
public class IntegrationPrivacyService implements com.raxim.myscoutee.domain.integrations.api.IntegrationPrivacy {
 private final MongoTemplate mongo;
 public IntegrationPrivacyService(MongoTemplate mongo) { this.mongo=mongo; }
 public void purgeParticipantData(String userId) {
  remove("integrationParticipantInvites",userId,"ownerUserId","claimedUserId");
  remove("mcpEventSubscriptions",userId,"ownerUserId");
  remove("integrationWebhookDeliveries",userId,"ownerUserId");
  remove("integrationExternalIds",userId,"ownerUserId");
  mongo.remove(Query.query(Criteria.where("resourceType").is("participant").and("internalId").is(userId)),"integrationExternalIds");
 }
 private void remove(String collection,String userId,String...fields) {
  if(!StringUtils.hasText(userId))return;
  mongo.remove(Query.query(new Criteria().orOperator(java.util.Arrays.stream(fields).map(field->Criteria.where(field).is(userId)).toArray(Criteria[]::new))),collection);
 }
}
