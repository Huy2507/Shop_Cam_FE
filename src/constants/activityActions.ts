export enum ActivityAction {
  UserLoggedIn = "UserLoggedIn",
  UserLoggedOut = "UserLoggedOut",
  TokenRefreshed = "TokenRefreshed",
  CreateCard = "CreateCard",
  CloneCard = "CloneCard",
  UpdateCard = "UpdateCard",
  DeleteCard = "DeleteCard",
  UploadAvatar = "UploadAvatar",
  UpdateProfile = "UpdateProfile",
  ChangePassword = "ChangePassword",
  UpgradeSubscription = "UpgradeSubscription",
  Other = "Other",
}

export interface ActivityActionConfig {
  value: ActivityAction;
  label: string;
  category: "auth" | "card" | "user" | "other";
  icon?: string;
}

export const ACTIVITY_ACTIONS: ActivityActionConfig[] = [
  {
    value: ActivityAction.UserLoggedIn,
    label: "activities.actions.login",
    category: "auth",
    icon: "LogIn",
  },
  {
    value: ActivityAction.UserLoggedOut,
    label: "activities.actions.logout",
    category: "auth",
    icon: "LogOut",
  },
  {
    value: ActivityAction.TokenRefreshed,
    label: "activities.actions.tokenRefresh",
    category: "auth",
    icon: "RefreshCw",
  },
  {
    value: ActivityAction.CreateCard,
    label: "activities.actions.create",
    category: "card",
    icon: "PlusCircle",
  },
  {
    value: ActivityAction.CloneCard,
    label: "activities.actions.clone",
    category: "card",
    icon: "Copy",
  },
  {
    value: ActivityAction.UpdateCard,
    label: "activities.actions.update",
    category: "card",
    icon: "Edit",
  },
  {
    value: ActivityAction.DeleteCard,
    label: "activities.actions.delete",
    category: "card",
    icon: "Trash",
  },
  {
    value: ActivityAction.UploadAvatar,
    label: "activities.actions.uploadAvatar",
    category: "user",
    icon: "Upload",
  },
  {
    value: ActivityAction.UpdateProfile,
    label: "activities.actions.updateProfile",
    category: "user",
    icon: "User",
  },
  {
    value: ActivityAction.ChangePassword,
    label: "activities.actions.changePassword",
    category: "user",
    icon: "Key",
  },
  {
    value: ActivityAction.UpgradeSubscription,
    label: "activities.actions.upgradeSubscription",
    category: "user",
    icon: "Crown",
  },
  {
    value: ActivityAction.Other,
    label: "activities.actions.other",
    category: "other",
    icon: "MoreHorizontal",
  },
];

export const getActivityFilterOptions = (
  t: (key: string) => string,
  category?: "auth" | "card" | "user" | "other",
) => {
  const allOption = { value: "all", label: t("filter.allActivities") };

  const filteredActions = category
    ? ACTIVITY_ACTIONS.filter((action) => action.category === category)
    : ACTIVITY_ACTIONS;

  const options = filteredActions.map((action) => ({
    value: action.value,
    label: t(action.label),
  }));

  return [allOption, ...options];
};
