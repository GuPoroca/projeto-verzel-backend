import z from "zod";
import prismaClient from "../utils/prismaClient.mjs";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

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
  
    const user = await prismaClient.user.findUnique({ where: { email } });
  
    if (!user) {
      return response.status(404).send({ message: "User not found." });
    }
  
    const isValid = await bcrypt.compare(password, user.password);
  
    if (!isValid) {
      return response.status(404).send({ message: "User not found." });
    }
  
    delete user.password;
  
    const token = jsonwebtoken.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    response.send({ token });
  }

  async storeUser(request, response) {
    const { username, email, password, icon } = request.body;

    const user = userSchema.parse({ email, username, password, icon });

    const checkUserEmail = await prismaClient.user.findUnique({
      where: { email },
    });

    if (checkUserEmail) {
      return response
        .status(404)
        .send({ message: "Email already being used." });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;
    user.hash = this.generateHash(user.email);

    await prismaClient.user.create({ data: user });

    delete user.password;

    response.send({ message: "stored", data: user });
  }

  async getUser(request, response){
    const { hash } = request.params;

    const user = await prismaClient.user.findUnique({ where: { hash } });

    if (!user) {
      return response.status(404).send({ message: "User not found." });
    }

    response.send(user.username);
  }

  generateHash(email) {
    // Base62 character set
    const referenceTable = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    // Convert email to a numeric ID
    let numericID = 0;
    for (let i = 0; i < email.length; i++) {
        numericID = (numericID * 31 + email.charCodeAt(i)) % 0x7FFFFFFF; // Use a large prime and modulus to avoid overflow
    }
    
    // Generate a base62 hash
    let genHashVal = "";
    let dummyId = numericID;
    const base = 62;

    do {
        const rem = dummyId % base;
        genHashVal = referenceTable[rem] + genHashVal;
        dummyId = Math.floor(dummyId / base);
    } while (dummyId > 0);
    
    // Pad the result to ensure it's 8 characters long
    const paddedHash = genHashVal.padStart(8, '0').slice(0, 8);

    return paddedHash;
  }

}
