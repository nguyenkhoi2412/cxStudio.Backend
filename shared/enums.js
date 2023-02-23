export const ROLE = {
  ADMIN: {
    name: "admin",
    power: ["GET", "POST", "PUT", "DELETE"],
  },
  SUPERVISOR: {
    name: "supervisor",
    power: ["GET", "POST", "PUT"],
  },
  USER: {
    name: "user",
    power: ["GET", "POST"],
  },
  VISITOR: {
    name: "visitor",
    power: ["GET"],
  },
};
