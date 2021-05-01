import { setLoginSession } from "@/lib/auth";
import { removeTokenCookie } from "@/lib/authCookies";
import bcrypt from "bcryptjs";

const LINK_CREATED = "LINK_CREATED";
const LINK_VOTED = "LINK_VOTED";

export default {
  User:{
    async links(parent, __, {Link, session}){
      const id = parent.id || session.userId;
      return await Link.find({postedBy: id}).exec();
    },

    async votes(parent, __, { Vote, session }){
      return await Vote.find({
        user: parent.id || session.userId  
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
    subscribe: (_, __ , {session, pubsub}) => {
      // if(!Boolean(session)){
      //   throw new Error(`Sign in required`)
      // }
      return pubsub.asyncIterator([LINK_CREATED]);
    },
  },
  newVote: {
    subscribe: (_, __ , { session, pubsub }) => {
      // if(!Boolean(session)){
      //   throw new Error(`Sign in required`)
      // }
      return pubsub.asyncIterator([LINK_VOTED]);
    }
  }
},


// Queries
  Query: {
    async me(_parent, __args, {session, User}) {
      if(!Boolean(session)){
        throw new Error(`Sign in required!`);
      }
      return await User.findById(session.userId).exec();
    },
    async isLoggedIn(_, __, {session}){
      return Boolean(session?.userId);
    },
    async isRegisteredUser(_, {email}, {User}){
      const user = await User.findOne({email}).exec();
      return Boolean(user);
    },
    async user(_, { id }, { User }){
      return await User.findById(id).exec();
    },
    async users(_ , __, { User }){
      return await User.find({}).exec()
    },
    async feed(_, { filter, orderBy }, { Link }){
      const queryCondition = filter ? {
        $text : { $search: filter }
      } : {};
      
      const mapSortField = {
        asc: 1,
        desc: -1
      }

      const sortCondition = { 
        "createdAt" : orderBy?.createdAt ? mapSortField[orderBy?.createdAt] : -1,
        "voteCount" : orderBy?.voteCount ? mapSortField[orderBy?.voteCount] : -1,
      };
      
      if(filter){
        sortCondition.score = { $meta: "textScore" };
      }

      return await Link.find(queryCondition).sort(sortCondition).exec();
    },
    async link(_ , {id}, { Link }){
      return await  Link.findById(id).exec();
    },
    
  },

  Mutation: {

    async signup(_, {email, password, name}, {User, res}){
      const existingUser = await User.findOne({email}).exec();

      if(Boolean(existingUser)){
        throw new Error(`User with ${email} already exist`);
      }

      // const passwordHash = await bcrypt.hash(password, 10);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt)
      const user = await User.create({
        name,
        email,
        password: passwordHash
      });

      // set httpOnly cookie
      setLoginSession(res, {userId: user.id})

      return user
    },

    async login(_, {email, password}, {User, res}){
      const user = await User.findOne({email}).exec()
      if (!user) {
        throw new Error('No such user found');
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Invalid password!');
      }
      
      // set httpOnly cookie
        setLoginSession(res, {userId: user.id})
  
        return user;
    },

    async signOut(_, __, {res}) {
      removeTokenCookie(res)
      return true
    },


    async post(_, {url,description}, {Link,pubsub, session}){

      if(!Boolean(session)){
        throw new Error(`Sign in to post link`)
      }

      const link = await Link.findOne({
        url
      }).exec()

      if(Boolean(link)){
        throw new Error(`${url} already exist`);
      }

      const newLink = await Link.create({
        url,
        description,
        postedBy: session.userId
      });
      
      pubsub.publish(LINK_CREATED, {newLink});
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

    async vote(_, {linkId}, { Vote, Link ,pubsub,session }){
     
      if(!Boolean(session)){
        throw new Error(`Sign in to post link`)
      }

      const vote = await Vote.findOne({
        link: linkId,
        user: session.userId
      }).exec();
      
      if(Boolean(vote)){
        throw new Error(`You have already voted for this link`)
      }
      
      const newVote =  await Vote.create({
        link: linkId,
        user: session.userId
      });
      
      await Link.findByIdAndUpdate(
        linkId,
        {$inc: {voteCount: 1}},
        {new: true}
      )
      // publish 
      pubsub.publish(LINK_VOTED, {
        newVote
      });

      return newVote;
    }
  }
}

