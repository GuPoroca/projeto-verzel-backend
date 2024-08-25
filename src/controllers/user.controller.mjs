import z from "zod";
import prismaClient from "../utils/prismaClient.mjs";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from 'bcrypt';

const userSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
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
    
    const token = jsonwebtoken.sign(user, process.env.JWT_SECRET);

    response.send({token});

  }

  async storeUser(request, response) {
    const { username, email, password, icon } = request.body;

    const user = userSchema.parse ({email, username, password, icon});

    const checkUserEmail = await prismaClient.user.findUnique({ where: { email } });

    if (checkUserEmail) {
      return response.status(404).send({ message: "Email already being used." });
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

}
