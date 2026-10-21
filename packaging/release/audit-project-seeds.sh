#!/usr/bin/env bash
# Product-specific seed contents; package identity and credential checks are shared.
audit_project_seeds() {
  local production_seed="$1"
  local content_languages="$(dirname -- "${BASH_SOURCE[0]}")/../../frontend/src/app/shared/core/common/content-languages.json"
  if ! jq -e 'type == "array" and length == 2
      and (map(._id) | sort) == ["myscoutee-community", "myscoutee-work"]
      and all(.[]; .ownerUserId == "system" and .visibility == "public"
        and .policy == {workspace: true, enabled: false, requiredFields: []})' \
      "${production_seed}/communityGroups.json" >/dev/null; then
    echo "Production community groups must contain only the two public system workspaces." >&2
    exit 1
  fi
  if [[ -f "${production_seed}/communityProviders.json" ]] && ! jq -e '
      type == "array" and length == 2
      and (map(._id) | sort) == ["discord", "discourse"]
      and all(.[];
        .configured == false and .available == true and .enabled == true
        and (keys | sort) == (["_id", "name", "purpose", "url", "configured", "available", "enabled", "sortOrder"] | sort)
        and .purpose == ("operator.community.provider." + ._id + ".purpose")
        and (if ._id == "discord"
          then .name == "Discord" and .url == "https://discord.com/" and .sortOrder == 10
          else .name == "Discourse" and .url == "https://www.discourse.org/" and .sortOrder == 20
          end))
    ' "${production_seed}/communityProviders.json" >/dev/null; then
    echo "Production community providers must contain only unconfigured built-in catalog definitions." >&2
    exit 1
  fi
  if ! jq -e --slurpfile languages "$content_languages" '
      [
        .[]
        | select(.documentType == "privacy" and .active == true)
      ] as $documents
      | ($languages[0] | map(.lang) | sort) as $expectedLanguages
      | (($documents | map(.lang) | sort) == $expectedLanguages)
      and all($documents[];
        ([.sections[] | select(.id == "contact-details")] | length == 1)
        and (
          [.sections[] | select(.id == "contact-details")][0].contentHtml
          == "{{deployment.privacy.contactDetails}}"
        )
        and ([.sections[] | select(.id == "account-data-deletion")] | length == 1)
        and (
          [.sections[] | select(.id == "account-data-deletion")][0].contentHtml
          | contains("{{deployment.privacy.deletionEmailRoute}}")
        )
        and (
          [.sections[] | .contentHtml // ""] | join(" ")
          | test("DPO|privacy@myscoutee|myscoutee1@gmail"; "i")
          | not
        ))
    ' "${production_seed}/helpCenterRevisions.json" >/dev/null; then
    echo "Production privacy help content must use runtime contact tokens without fixed privacy identities." >&2
    exit 1
  fi

}
