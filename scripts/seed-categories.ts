import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Music",
  "Sports",
  "Travel and events",
  "Pets and animals",
  "How-to and style",
  "Entertainment",
  "News and politics",
  "People and blogs",
  "Sicence and technology",
  "Film and animation",
];

async function main() {
  try {
    for (const name of categoryNames) {
      await db
        .insert(categories)
        .values({
          name,
          description: `Videos related to ${name.toLowerCase()}`,
        })
        .onConflictDoUpdate({
          target: categories.name,
          set: {
            description: `Videos related to ${name.toLowerCase()}`,
          },
        });
    }
  } catch (error) {
    process.exit(1);
  }
}

main();
