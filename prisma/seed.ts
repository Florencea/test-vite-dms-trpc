import { prisma } from ".";

const DEFAULT_ADMIN = {
  account: "admin",
  name: "Admin",
  email: "user@example.com",
  password: "string",
};

async function main() {
  await prisma.user.upsert({
    where: {
      account: DEFAULT_ADMIN.account,
    },
    create: { ...DEFAULT_ADMIN },
    update: { ...DEFAULT_ADMIN },
  });
  await prisma.datatable002.create({
    data: {
      stringColumn: "xxx",
      floatColumn: 1.2,
      integerColumn: 1,
      booleanColumn: true,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
