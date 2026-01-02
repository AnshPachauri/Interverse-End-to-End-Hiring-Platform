import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "interverse" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("➡️ Received Clerk user.created event");
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);
    console.log("✅ Created new user in MongoDB");

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "user.deleted" },
  async ({ event }) => {
    console.log("➡️ Received Clerk user.deleted event");
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
    console.log("✅ Deleted user from MongoDB");
    await deleteStreamUser(id.toString());
  }
);

const logAll = inngest.createFunction(
  { id: "log-all-events" },
  { event: "*" },
  async ({ event }) => console.log("📦 Event received:", event.name)
);

export const functions = [syncUser, deleteUserFromDB, logAll];
