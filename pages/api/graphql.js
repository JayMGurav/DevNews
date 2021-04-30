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

  subscriptions: {
    path: '/api/graphqlSubscriptions',
    keepAlive: 9000,
    onConnect: (connectionParams, websocket, context) => {
      // get cookie from request headers
      console.log('subscription connected')
      const session = getLoginSession(context.request);
      return {
        session
      }
    },
    onDisconnect: () => console.log('subscription disconnected'),
  },
  playground: {
    // subscriptionEndpoint: '/api/graphqlSubscriptions',
    settings: {
      "request.credentials": "same-origin"
    }
  },
 

  async context({ req, res, connection }) {
    if(connection){
      // websocket connection
      return {
        ...connection.context,
        User,
        Link,
        Vote,
        pubsub
      }
    }else {
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
    }
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res, next) => {
    if (!res.socket.server.apolloServer) {
      console.log(`* apolloServer initialization *`);
  
      apolloServer.installSubscriptionHandlers(res.socket.server);
      const handler = apolloServer.createHandler({ path: '/api/graphql' });
      res.socket.server.apolloServer = handler;
    }
  
    return res.socket.server.apolloServer(req, res, next);
};

// export default apolloServer.createHandler({ path: '/api/graphql' });