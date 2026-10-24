type == "array" and length == 2
      and (map(._id) | sort) == ["myscoutee-community", "myscoutee-work"]
      and all(.[]; .ownerUserId == "system" and .visibility == "public"
        and .policy == {workspace: true, enabled: false, requiredFields: []})
