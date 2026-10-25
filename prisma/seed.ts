import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert seeded users so re-running seed is safe
  const alice = await prisma.user.upsert({
    where: { email: "alice@demo.com" },
    update: {},
    create: {
      id: "user_alice",
      name: "Alice",
      email: "alice@demo.com",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Alice",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@demo.com" },
    update: {},
    create: {
      id: "user_bob",
      name: "Bob",
      email: "bob@demo.com",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Bob",
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@demo.com" },
    update: {},
    create: {
      id: "user_carol",
      name: "Carol",
      email: "carol@demo.com",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Carol",
    },
  });

  // Seed a sample document for Alice
  const doc = await prisma.document.upsert({
    where: { id: "doc_sample" },
    update: {},
    create: {
      id: "doc_sample",
      title: "Welcome to Docs",
      content:
        "<h1>Welcome to Docs</h1><p>This is a <strong>sample document</strong>. You can <em>edit</em>, <u>format</u>, and share it.</p><ul><li>Bold, italic, underline</li><li>Headings</li><li>Bullet and numbered lists</li></ul>",
      ownerId: alice.id,
    },
  });

  // Share Alice's doc with Bob
  await prisma.documentShare.upsert({
    where: { documentId_userId: { documentId: doc.id, userId: bob.id } },
    update: {},
    create: { documentId: doc.id, userId: bob.id },
  });

  console.log("Seeded users:", alice.name, bob.name, carol.name);
  console.log("Seeded document:", doc.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
