import mongoose from "mongoose";

const dbService = {
  db: undefined,
  connect: async (callback) => {
    await mongoose
      .connect(process.env.DB_CONNECT, {
        promiseLibrary: Promise,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then((db) => {
        //     // update fields
        //     // mongoose.connection.collection("sites").updateMany({}, {$set:{"locale": "en"}})

        //     // rename fields
        //     // mongoose.connection.collection("sites").updateMany({}, {$rename:{"en": "locale"}})

        //     // rename collections
        //     // mongoose.connection.collection("sites_type_menuitems").rename("types");

        console.log(`Database connected: ${db.connection.host}`);
        callback(null);
      })
      .catch((err) => {
        mongoose.close();
        console.error("Database connection error: ", err);
      });
  },
};

export default dbService;
