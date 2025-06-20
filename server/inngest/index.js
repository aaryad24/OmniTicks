import { Inngest } from "inngest";
import User from "../models/User.js";


export const inngest = new Inngest({ id: "movie-ticket-booking" });

//innegest funtion to save user data to a Database
const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk',
    timeout: 30,
    retries: 3, // 👈 Add automatic retries
  },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0]?.email_address, // 👈 Optional chaining
        name: `${first_name || ''} ${last_name || ''}`.trim(), // 👈 Safer concatenation
        image: image_url,
      };
      await User.create(userData);
    } catch (err) {
      console.error("Failed to sync user:", err);
      throw err; // 👈 Let Inngest retry
    }
  }
);


const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    { event: 'clerk/user.deleted' },
    async({ event })=>{
        const{id} = event.data
        
        await User.findByIdAndDelete(id);
    }
)


const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    { event: 'clerk/user.updated' },
    async({ event })=>{

        const{id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image:image_url
        }
        await User.findByIdAndUpdate(id, userData);
    }
)




export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];