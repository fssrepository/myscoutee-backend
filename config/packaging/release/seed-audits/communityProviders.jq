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
