export const ACCOUNT_STATUS = {
  ACTIVE: {
    name: "ACTIVE",
    description: "Accounts is active.",
  },
  PENDING: {
    name: "PENDING",
    description:
      "Accounts have a pending status when the process of self registration, email verification or ask password has been initiated and the confirmation mail has been sent, but the email has not been verified yet. The status claim will be set depending on the flow.",
  },
  LOCKED: {
    name: "LOCKED",
    description:
      "Accounts have a locked out status when the user exceeds the number of login attempts defined in the login policy.",
  },
  DISABLED: {
    name: "DISABLED",
    description: "Accounts is disabled.",
  },
};
