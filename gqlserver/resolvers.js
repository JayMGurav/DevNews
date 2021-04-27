import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const LINK_CREATED = "LINK_CREATED";
const LINK_VOTED = "LINK_VOTED";

export default {
  User:{
    async links(parent, __, {Link}){
      return await Link.find({postedBy: parent.id}).exec();
    },

    async votes(parent, __, { Vote }){
      return await Vote.find({
        user: parent.id 
      }).exec();
    },
  },

  Link: {
    async postedBy(parent, __, {User}){
      return await User.findById(parent.postedBy).exec();
    },
    async votes(parent, __, { Vote }){
      return await Vote.find({
        link: parent.id 
      }).exec();
    },
  },

  Vote: {
    async link(parent, __, { Link }) {
      return await Link.findById(parent.link).exec();
    },
    async user(parent, __, { User }) {
      return await User.findById(parent.user).exec();
    }
  },

// Subscriptions
Subscription: {
  newLink: {
    subscribe: (_, __ , { pubsub }) => pubsub.asyncIterator([LINK_CREATED]),
  },
  newVote: {
    subscribe: (_, __ , { pubsub }) => pubsub.asyncIterator([LINK_VOTED]),
  }
},


// Queries
  Query: {

    async user(_, { id }, { User }){
      return await User.findById(id).exec();
    },
    async users(_ , __, { User }){
      return await User.find({}).exec()
    },
    async feed(_, { filter }, { Link }){
      const queryCondition = filter ? {
        $text : { $search: filter }
      } : {};
      
      const sortCondition = filter ? { score: { $meta: "textScore" } } : { "createdAt" : -1 };
      return await Link.find(queryCondition).sort(sortCondition).exec();
    },
    async link(_ , {id}, { Link }){
      return await  Link.findById(id).exec();
    },
    
  },

  Mutation: {

    async signup(_, {email, password, name}, {User}){
      const existingUser = await User.findOne({email}).exec();

      if(Boolean(existingUser)){
        throw new Error(`User with ${email} already exist`);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: passwordHash
      });

      const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);

      return {
        token,
        user
      }

    },

    async login(_, {email, password}, {User}){
      const user = await User.findOne({email}).exec()
      if (!user) {
        throw new Error('No such user found');
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Invalid password!');
      }

      const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
      
      return {
        token,
        user
      }
    },

    async post(_, {url,description}, {Link,pubsub}){
      const link = await Link.findOne({
        url
      }).exec()

      if(Boolean(link)){
        throw new Error(`${url} already exist`);
      }

      const newLink = await Link.create({
        url,
        description,
        postedBy: "60857324de0a0c5524f678ff"
      });

      pubsub.publish("LINK_CREATED", {newLink});
      return newLink;
    },

    async updateLink(_, {id, url, description}, {Link}){
      return await Link.findByIdAndUpdate(
        id,
        { $set: {url, description} },
        {new: true}   
      );
    },

    async deleteLink(_, {id}, { Link }){
      return await Link.findByIdAndDelete(id);
    },

    async deleteVote(_, {linkId}, { Vote }){
      return await Vote.deleteMany({
        link: linkId,
      });
    },

    async vote(_, {linkId}, { Vote,pubsub }){

      const userId = "60857324de0a0c5524f678ff";

      const vote = await Vote.findOne({
        link: linkId,
        user: userId
      }).exec();
      console.log({vote});
      
      if(Boolean(vote)){
        throw new Error(`Already voted for link: ${linkId}`)
      }
      
      
      
      const newVote =  await Vote.create({
        link: linkId,
        user: userId
      });
      
      // publish 
      pubsub.publish("LINK_VOTED", {newVote});
      return newVote;
    }
  }
}

