import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb://localhost:27017/wedplan";

const client = new MongoClient(uri);
const dbName = process.env.MONGODB_DATABASE || "wedplan";
const db = client.db(dbName);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET ||
        process.env.GITHUB_CLIENT_SECRETS ||
        "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "default_wedplan_secret_key_change_me",
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
});
