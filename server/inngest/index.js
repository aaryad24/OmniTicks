import { Inngest } from "inngest";

export const inngesr = new Inngest{( id: "movie-ticket-booking" )};

//innegest funtion to save user data to a Database
const syncUserCreation = inngest.createFuntion(
    {id: 'sync-user-from-cleark'},
    { event: 'clerk/user.created' },
    async({ event })=>{
        const{id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name:first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData),
    }
)


const syncUserDeletion = inngest.createFuntion(
    {id: 'delete-user-from-cleark'},
    { event: 'clerk/user.deleted' },
    async({ event })=>{
        const{id} = event.data
        
        await User.findByIdAndDelete(id),
    }
)


const syncUserUpdation = inngest.createFuntion(
    {id: 'update-user-from-cleark'},
    { event: 'clerk/user.updated' },
    async({ event })=>{

        const{id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image:image_url
        }
        await User.findByIdAndupdate(id, userData),
    }
)




export const funtions = [syncUserCreation, syncUserDeletion, syncUserUpdation];