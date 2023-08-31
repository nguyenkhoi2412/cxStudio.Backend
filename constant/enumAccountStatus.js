export const ACCOUNT_STATUS = {
  ACTIVE: {
    TEXT: "ACTIVE",
    DESC: "Accounts is active.",
  },
  PENDING: {
    TEXT: "PENDING",
    DESC:
      "Accounts have a pending status when the process of self registration, email verification or ask password has been initiated and the confirmation mail has been sent, but the email has not been verified yet. The status claim will be set depending on the flow.",
  },
  LOCKED: {
    TEXT: "LOCKED",
    DESC:
      "Accounts have a locked out status when the user exceeds the number of login attempts defined in the login policy.",
  },
  DISABLED: {
    TEXT: "DISABLED",
    DESC: "Accounts is disabled.",
  },
};
