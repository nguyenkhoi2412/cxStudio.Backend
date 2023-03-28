export const ROLE = {
  ADMIN: {
    name: "admin",
    power: ["GET", "POST", "PUT", "DELETE"],
    description: "This role accept all methods (can delete data)",
  },
  SUPERVISOR: {
    name: "supervisor",
    power: ["GET", "POST", "PUT"],
    description:
      'This role accept methods: "GET", "POST", "PUT". Method "DELETE" just update status isActive in database.',
  },
  USER: {
    name: "user",
    power: ["GET", "POST"],
    description: 'This role accept methods: "GET", "POST"',
  },
  VISITOR: {
    name: "visitor",
    power: ["GET"],
    description: 'This role accept methods: "GET"',
  },
  // POWER: {
  //   name: "power",
  //   power: ["GET"],
  //   description:
  //     'This role accept methods: "GET", "POST", "PUT". Method "DELETE" just update status isActive in database.',
  // },
  // OWNER: {
  //   name: "owner",
  //   power: ["GET"],
  //   description: "This role accept all methods (can delete data)",
  // },
};
