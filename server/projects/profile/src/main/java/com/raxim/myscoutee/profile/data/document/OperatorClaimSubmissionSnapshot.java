package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "operatorClaimSubmissionSnapshots")
public class OperatorClaimSubmissionSnapshot {
    public static final String SINGLETON_ID = "deployment-operator-claim";
    public static final int SCHEMA_VERSION = 1;

    @Id
    private String id;
    @Version
    private Long version;
    private Integer schemaVersion;
    private String legalName;
    private String registrationNumber;
    private String jurisdiction;
    private String registeredAddress;
    private String website;
    private String verificationContactName;
    private String verificationContactRole;
    private String verificationContactEmail;
    private Boolean authorityAttested;
    private String registryScope;
    private String deploymentId;
    private String operatorGroupId;
    private String submittedAt;
    private String submittedBy;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public Integer getSchemaVersion() {
        return schemaVersion;
    }

    public void setSchemaVersion(Integer schemaVersion) {
        this.schemaVersion = schemaVersion;
    }

    public String getLegalName() {
        return legalName;
    }

    public void setLegalName(String legalName) {
        this.legalName = legalName;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getJurisdiction() {
        return jurisdiction;
    }

    public void setJurisdiction(String jurisdiction) {
        this.jurisdiction = jurisdiction;
    }

    public String getRegisteredAddress() {
        return registeredAddress;
    }

    public void setRegisteredAddress(String registeredAddress) {
        this.registeredAddress = registeredAddress;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getVerificationContactName() {
        return verificationContactName;
    }

    public void setVerificationContactName(String verificationContactName) {
        this.verificationContactName = verificationContactName;
    }

    public String getVerificationContactRole() {
        return verificationContactRole;
    }

    public void setVerificationContactRole(String verificationContactRole) {
        this.verificationContactRole = verificationContactRole;
    }

    public String getVerificationContactEmail() {
        return verificationContactEmail;
    }

    public void setVerificationContactEmail(String verificationContactEmail) {
        this.verificationContactEmail = verificationContactEmail;
    }

    public Boolean getAuthorityAttested() {
        return authorityAttested;
    }

    public void setAuthorityAttested(Boolean authorityAttested) {
        this.authorityAttested = authorityAttested;
    }

    public String getRegistryScope() {
        return registryScope;
    }

    public void setRegistryScope(String registryScope) {
        this.registryScope = registryScope;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public void setDeploymentId(String deploymentId) {
        this.deploymentId = deploymentId;
    }

    public String getOperatorGroupId() {
        return operatorGroupId;
    }

    public void setOperatorGroupId(String operatorGroupId) {
        this.operatorGroupId = operatorGroupId;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }
}
