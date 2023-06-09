import { db } from "../config/db.server";
import * as helper from "../utils/helper";
import { Admin, AdminRead } from "../types/admin.type";


export const registerAdmin = async (admin: Admin): Promise<AdminRead> => {
   const { email, password } = admin;
   const adminExist = await db.admin.findUnique({
      where: { email },
   });
   if (adminExist) throw new Error("Admin Already Exist");
   return await db.admin.create({
      data: {
         email,
         password: await helper.hashPassword(password)
      },
      select: {
         id: true,
         email: true,
         createdAt: true,
         updatedAt: true}
   })
} ;

export const loginAdmin = async (admin: Admin): Promise<string> => {
   const { email, password } = admin;
   const adminExist = await db.admin.findUnique({
      where: { email },
   });
   if (!adminExist) throw new Error("Admin Does Not Exist");
   const isMatch = await helper.comparePassword(password, adminExist.password);
   if (!isMatch) throw new Error("Invalid Credentials");
   //return await helper.generateToken(adminExist.id);
   return isMatch.toString();
}
