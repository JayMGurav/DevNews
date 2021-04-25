import { ApolloServer} from 'apollo-server-micro'
import mongoose from "mongoose"

import schema from "@/gqlserver/schema"
import User from "@/models/user"
import Link from "@/models/link"


const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}


const apolloServer = new ApolloServer({ 
    schema,
    async context({req, res}) {
      
      if (cached.conn) {
        return {
          User,
          Link
        }
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
          }
      
          cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose
          })
        }
        cached.conn = await cached.promise;
        return {
          User,
          Link
        }
      } catch (error) {
        console.error('Error connecting mongoDB', error.message)
      }
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' });