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

Making authServices ie. all backend functions are written here for authentication

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

### Similary made for config.js for Services used in Blog 'CRUD'

# Create Store
    use create Redux and do 
    initial state: status, userData
    make slice and define login logout functions
    make store and import reducers
    
    use them by useDispatch and useSelector

# Create authSlice.js
    import { createSlice } from "@reduxjs/toolkit";

        const initialState = {
            status: false,
            userData: null
        }

        const authSlice = createSlice({
            name: "auth",
            initialState,
            reducers: {
                login: (state, action) => {
                    state.status = true;
                    state.userData = action.payload.userData;
                },
                logout: (state) => {
                    state.status = false;
                    state.userData = null;
                }
            }
        })

        export const {login, logout} = authSlice.actions;

        export default authSlice.reducer;

# Building pages

## Header
    make different buttons to be available according to login or logout (Navigator is used)
    Make LogoutBtn
    
### Navigator
This is how we use navigator

    const navigate = useNavigate()
    const navItems = [
    {
    name: 'Home',
    slug: '/',
    active: true
    },
    {
    name: 'Login',
    slug: '/login',
    active: !authStatus
    },
    {
    name: 'SignUp',
    slug: '/signup',
    active: !authStatus
    },
    {
    name: 'All Posts',
    slug: '/all-posts',
    active: authStatus
    },
    {
    name: 'Add Post',
    slug: '/add-post',
    active: authStatus
    }
    ]

    onClick={() => navigate(item.slug)}

## Input.jsx
    This component is resused to in
    :tile, slug 

By using forwardRef hook 

    forwardRef: (in latest version directly is also allowed)

    forwardRef in React is used to forward a ref to a child component from a parent component. This allows the parent component to access the child component's DOM node, but it doesn't necessarily mean the parent component has full control over the child component.

    forwardRef is often used in scenarios where the parent component needs to:

    Access the child component's DOM node for styling or layout purposes.
    Expose methods or properties to the parent component, allowing it to manipulate the child component's behavior.
    However, the child component still maintains its own state and behavior, and the parent component's control is limited to what is exposed through the ref or methods.

    So, while forwardRef does enable the parent component to have some control over the child component, it's not a direct or absolute control.

## Create RTE 

A ref is passed separately

    const Input = forwardRef( 
    function Input({
        label,
        type = "text",
        className = "",
        ...props
    },ref){
        const id = useId()
        return (
            <div className='w-full'>
                {label && 
                <label
                className='inline-block mb-1 pl-1'
                htmlFor='{id}'
                >
                    {label}
                </label>}
                <input 
                type="text" 
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                ref = {ref}
                {...props}
                id={id}//if the label is clicked the particular input highlights
                />

            </div>
        )
    }
    )

# PostForm 

This is the most important and difficult

check the chatGpt: [React Blog Project 💥very IMP](https://chatgpt.com/share/67840a34-d8b8-800f-a6db-30a9d9c78726)

imp points:

    Let’s analyze the role of the onInput handler in the Slug field and why it's included despite the useEffect already handling title changes.

    Understanding the Two Different Scenarios
    1. Slug Auto-Update on Title Change (useEffect with watch)
    The useEffect is triggered when the title field changes.
    This is done via the watch method, which listens to changes in the title field and updates the slug automatically using the slugTransform function.
    Purpose: Ensures that the slug value updates in real-time based on title changes.

    2. Manual Edit of the Slug Field (onInput in Slug)
    The slug field allows users to manually edit the generated slug.
    When users manually input text into the slug field, the onInput handler applies the same transformation (slugTransform) and updates the value in the form state using setValue.


Why No onChange?
When you use register, react-hook-form internally wires the input field to automatically handle onChange, onBlur, and other events.

    register Function:
    It’s a method from react-hook-form that connects your input field to the form state.
    It handles:
    Value tracking (e.g., watching for changes in title)
    Validation rules (e.g., { required: true } makes the field mandatory)
    Event handling (e.g., no need to write onChange, as register already tracks changes automatically).

Why Use shouldValidate?
The shouldValidate: true option ensures that setting the new slug value triggers validation for the slug field.

What is watch?
watch is a method from react-hook-form that observes form field values and listens for changes in real time.
In this case, it listens to changes in the entire form's state or specific fields.

    onInput :

    The onInput event is an HTML DOM event triggered whenever the value of an input or textarea changes. It fires immediately as the user types, unlike onChange, which fires only when the input loses focus or the value changes programmatically.

    As the user types or edits the slug field, onInput applies the slugTransform to clean the input and ensure consistency.