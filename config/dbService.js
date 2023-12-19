import mongoose from "mongoose";

const dbService = {
  db: undefined,
  connect: async (callback) => {
    await mongoose
      .connect(process.env.DB_CONNECT, {})
      .then((db) => {
        // update fields
        // mongoose.connection.collection("sites").updateMany({}, {$set:{"locale": "en"}})

        // rename fields
        // mongoose.connection.collection("sites").updateMany({}, {$rename:{"en": "locale"}})

        // rename collections
        // mongoose.connection.collection("fieldsof").rename("industries");

        console.log(`Database connected: ${db.connection.host}`);
        callback(null);
      })
      .catch((err) => {
        console.error("Database connection error: ", err);
        process.exit(1);
      });
  },
};

export default dbService;
