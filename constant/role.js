export const ROLE = {
  ADMIN: {
    _id: "b36d5833-1ed1-410e-a8a8-ab541cfd99bf",
    name: "admin",
    power: ["GET", "POST", "PUT", "DELETE"],
    description: "This role accept all methods (can delete data)",
    type: 1,
    order_by: 1,
  },
  SUPERVISOR: {
    _id: "3137618d-f818-4973-a64c-a493635a19ae",
    name: "supervisor",
    power: ["GET", "POST", "PUT"],
    description:
      'This role accept methods: "GET", "POST", "PUT". Method "DELETE" just update status isActive in database.',
    type: 1,
    order_by: 2,
  },
  USER: {
    _id: "46cb99b0-c393-428c-8bdb-7b3a73bac858",
    name: "user",
    power: ["GET", "POST"],
    description: 'This role accept methods: "GET", "POST"',
    type: 1,
    order_by: 3,
  },
  VISITOR: {
    _id: "3f148806-9372-4407-af80-0ae5e53d9df7",
    name: "visitor",
    power: ["GET"],
    description: 'This role accept methods: "GET"',
    type: 1,
    order_by: 4,
  },
  OWNER: {
    _id: "871636a4-a363-4438-87cc-b98ffc4648d2",
    name: "owner",
    power: ["GET", "POST", "PUT"],
    description:
      'This role accept methods: "GET", "POST", "PUT". Method "DELETE" just update status isActive in database.',
    type: 2,
    order_by: 1,
  },
  TEAM_MEMBERS: {
    _id: "7f9f9b5d-701a-44b7-bdd0-3628cd32c0ea",
    name: "team_members",
    power: ["GET", "POST"],
    description: 'This role accept methods: "GET", "POST"',
    type: 2,
    order_by: 2,
  },
};
