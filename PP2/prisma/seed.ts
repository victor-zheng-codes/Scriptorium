
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try{
    const hashedPassword = await bcrypt.hash("Password1!", 10);

    const user = await prisma.user.findUnique({
      where: {
        userId: 1,
      },
    })

    if (user){
      console.log("User id 1 already exists")
      return 
    }

    await prisma.user.create({
        data: {
            userId: 1,
            email: "admin@example.com",
            username: "admin",
            password: hashedPassword,
            firstName: "John",
            lastName: "Doe",
            avatar: "bear.png",
            phoneNumber: "123-456-6789",
            isAdmin: true,
            refreshToken: null,
            createdAt: "2024-01-05T10:30:00.000Z",
            updatedAt: "2024-01-05T10:30:00.000Z",
        }
    });

  } catch (error) {
      console.log(`Error processing seeding data ${error}`);
    }
  }

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });