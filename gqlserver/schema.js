import {makeExecutableSchema} from "apollo-server-micro";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

export default makeExecutableSchema({
  typeDefs,
  resolvers
});