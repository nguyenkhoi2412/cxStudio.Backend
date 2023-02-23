const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

// config cors with options
export default {
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  methods: allowedMethods,
  credentials: true,
  // origin: true,
  origin: (origin, callback) => {
    //* get whitelist from enviroment
    const whitelist =
      process.env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGINS : "*";
    if (whitelist === "*" || whitelist.split(",").indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(" Your domain do not accept here"));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
