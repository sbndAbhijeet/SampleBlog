# React with Appwrite

# Steps: 
    1. Make .env (which is not ment to be exported also duplicate it as .env.sample) used for storing the varibles used to connect appwrite
        appwrite_url
        database_id
        project_id
        collection_id
        bucket_id

    2.create the project (in appwrite) and assign the given values

    3.config (for better using those env variables)

    4.For Authentication (create a folder) make a class and export a created object to making an organised structure and define all the methods in it

## Future Proof Snippet

    import conf from "../conf/conf.js"
    import { Client, Account, ID } from "appwrite";

    export class AuthService {
        client = new Client();
        account;

        constrcutor() {
            this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);
            this.account = new Account(this.client);
        }

        async createAccount({email, password, name}){
            try{
                const userAccount = await this.account.create(ID.unique(), email, password, name);
                if(userAccount){
                    //call another method
                    return this.login({email,password});
                } else{
                    return userAccount;
                }
            } catch(error){
                throw error;
            }
        }

        async login({email, password}){
            try {
                return await this.account.createEmailPasswordSession(email,password)
            } catch (error) {
                throw error;
            }
        }

        async getCurrentUser(){
            try {
                return await this.account.get();
            } catch (error) {
                console.log('Appwrite service :: getCurrentUser :: error', error);
                
            }
            return null;
        }

        async logout(){
            try {
                await this.account.deleteSessions();
            } catch (error) {
                console.log('Appwrite service :: logout :: error', error);
            }
        }
    }

    const authService = new AuthService();

    export default authService


We can also use storage services for backup or reuse

### Similary made for Auth.js for authentication

# Create Store

