import z from "zod";
import prismaClient from "../utils/prismaClient.mjs";
import jsonwebtoken from "jsonwebtoken";
import env from '../utils/env.mjs';
import bcrypt from 'bcrypt';

const userSchema = z.object({
  id: z.string().optional(),
  login: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(1),
  icon: z.number().default(0),
});

export default class UserController {
  
  async auth(request, response) {
    const { email, password } = request.body;

    userSchema.parse({email, password});

    const user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
        return response.status(404).send({ message: "User not found." });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid){
        return response.status(404).send({ message: "User not found." });
    }

    delete user.password;
    
    const token = jsonwebtoken.sign(user, env.JWT_SECRET);

    response.send({token});

  }

  async index(request, response) {
    const users = await prismaClient.user.findMany();
    response.send({
      page: 1,
      pageSize: 20,
      totalCount: users.length,
      items: users,
    });
  }

  async storeUser(request, response) {
    const { nome, email, password } = request.body;

    const user = userSchema.parse ({email, nome, password});

    const newUser = await prismaClient.user.findUnique({ where: { email } });

    if (newUser) {
      return response.status(404).send({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword =  await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    await prismaClient.user.create({data: user});

    delete user.password;

    response.send({ message: "stored", data: user});
  }

  async getOneUser(request, response) {
    const { email } = request.params;

    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      return response.status(404).send({ message: "User not found." });
    }

    response.send(user);
  }

  async destroyUser(request, response) {
    const { email } = request.params;

    const deleteUser = await prismaClient.user.findUnique({ where: { email } });

    if (!deleteUser) {
      return response.status(404).send({ message: "User not found." });
    }
    try {
      await prismaClient.user.delete({ where: { email } });
    } catch (error) {
      return response.status(400).send({ message: "User with characters linked to them" });
    }
      

    response.status(200).send({ message: `User ${email} Deleted` });
  }
}
