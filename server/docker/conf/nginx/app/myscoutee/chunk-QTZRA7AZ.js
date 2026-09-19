// src/app/shared/ui/converters/profile-header-card.converter.ts
var ProfileHeaderCardConverter = class {
  static convert(user, options = {}) {
    const admin = options.admin === true;
    const name = `${options.name ?? user.name ?? ""}`.trim();
    const completion = admin ? user.completion : options.completionPercent ?? user.completion;
    return {
      admin,
      statusClass: admin ? "status-friends" : this.profileStatusClass(options.profileStatus ?? user.profileStatus),
      title: admin ? name : `${name}, ${options.age ?? user.age}`,
      meta: admin ? `${options.headline ?? user.headline ?? ""}`.trim() || "Admin workspace" : `${options.city ?? user.city ?? ""}`.trim(),
      metaIcon: admin ? "admin_panel_settings" : "location_on",
      imageUrl: this.firstImageUrl(user.images),
      initials: user.initials,
      gender: user.gender,
      badgeLabel: admin ? "ADMIN" : `${completion}%`,
      badgeStyle: this.completionBadgeStyle(completion),
      showEdit: options.showEdit === true,
      editDisabled: options.editDisabled === true,
      editAriaLabel: options.editAriaLabel ?? "Edit",
      showRing: options.showRing === true,
      ringState: options.ringState ?? "loading",
      ringTitle: options.ringTitle ?? null
    };
  }
  static profileStatusClass(status) {
    switch (status) {
      case "public":
        return "status-public";
      case "friends only":
        return "status-friends";
      case "host only":
        return "status-host";
      case "blocked":
        return "status-blocked";
      default:
        return "status-inactive";
    }
  }
  static firstImageUrl(images) {
    return (images ?? []).map((image) => `${image ?? ""}`.trim()).find(Boolean) ?? null;
  }
  static completionBadgeStyle(value) {
    const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
    const hue = Math.round(clamped / 100 * 120);
    return {
      background: `hsl(${hue}, 82%, 84%)`,
      borderColor: `hsl(${hue}, 70%, 58%)`,
      color: `hsl(${hue}, 74%, 24%)`
    };
  }
};

export {
  ProfileHeaderCardConverter
};
//# sourceMappingURL=chunk-QTZRA7AZ.js.map
