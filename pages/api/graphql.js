import { ApolloServer  } from "apollo-server-micro";
import { PubSub } from 'graphql-subscriptions';
import mongoose from "mongoose";

import schema from "@/gqlserver/schema";
import User from "@/models/UserModel";
import Link from "@/models/LinkModel";
import Vote from "@/models/VoteModel";
import { getLoginSession } from "@/lib/auth";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}
const pubsub = new PubSub();

const apolloServer = new ApolloServer({
  schema,
  async context({ req, res }) {
    // set up auth
    const session = getLoginSession(req);
    if (cached.conn) {
      return {
        User,
        Link,
        Vote,
        pubsub,
        req,
        res,
        session
      };
    }
    try {
      if (!cached.promise) {
        const opts = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          bufferCommands: false,
          bufferMaxEntries: 0,
          useFindAndModify: false,
          useCreateIndex: true,
        };

        cached.promise = mongoose
          .connect(MONGODB_URI, opts)
          .then((mongoose) => {
            return mongoose;
          });
      }
      cached.conn = await cached.promise;
      return {
        User,
        Link,
        Vote,
        pubsub,
        req,
        res,
        session
      };
    } catch (error) {
      console.error("Error connecting mongoDB", error.message);
    }
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res, next) => {
    // does not support fash-referesh our how reload: as stale listerners should be deleted 
    // await runMiddleware(req, res);
    if (!res.socket.server.apolloServer) {
      console.log(`* apolloServer initialization *`);
  
      apolloServer.installSubscriptionHandlers(res.socket.server);
      const handler = apolloServer.createHandler({ path: '/api/graphql' });
      res.socket.server.apolloServer = handler;
    }
  
    return res.socket.server.apolloServer(req, res, next);
    // apolloServer.createHandler({ path: "/api/graphql" })
};

// export default apolloServer.createHandler({ path: '/api/graphql' });