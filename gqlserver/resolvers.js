import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export default {
  User:{
    async links(parent, __, {Link}){
      return await Link.find({postedBy: parent.id}).exec();
    }
  },

  Link: {
    async postedBy(parent, __, {User}){
      return await User.findById(parent.postedBy).exec();
    }
  },

  Query: {

    async user(_, { id }, { User }){
      return await User.findById(id).exec();
    },
    async users(_ , __, { User }){
      return await User.find({}).exec()
    },
    async feed(_, __, { Link }){
      return await Link.find({}).exec();
    },
    async link(_ , {id}, { Link }){
      return await  Link.findById(id).exec();
    },
    
  },

  Mutation: {

    async signup(_, {email, password, name}, {User}){
  
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
        throw new Error('Invalid password');
      }

      const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
      
      return {
        token,
        user
      }

    },

    async post(_, {url,description}, {Link}){
      return await Link.create({
        url,
        description,
        postedBy: "60857324de0a0c5524f678ff"
      });
    },

    async updateLink(_, {id, url, description}, {Link}){
      return await Link.findByIdAndUpdate(
        id,
        { $set: {url, description} },
        {new: true}   
      );
    },

    async deleteLink(_, {id}, {Link}){
      return await Link.findByIdAndDelete(id);
    }
  }
}

