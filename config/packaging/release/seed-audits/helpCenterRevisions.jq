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
