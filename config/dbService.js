import mongoose from "mongoose";

const dbService = {
  db: undefined,
  connect: async (callback) => {
    await mongoose.connect(
      process.env.DB_CONNECT,
      {
        promiseLibrary: Promise,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
      (err, data) => {
        if (err) {
          mongoose.close();
          callback(err);
        }

        dbService.db = data;

        // update fields
        // mongoose.connection.collection("sites").updateMany({}, {$set:{"locale": "en"}})

        // rename fields
        // mongoose.connection.collection("sites").updateMany({}, {$rename:{"en": "locale"}})

        // rename collections
        // mongoose.connection.collection("sites_type_menuitems").rename("types");

        console.log(`Database connected: ${data.connection.host}`);
        callback(null);
      }
    );
  },
};

export default dbService;
