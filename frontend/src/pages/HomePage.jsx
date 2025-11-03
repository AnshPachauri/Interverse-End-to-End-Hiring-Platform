import { SignedOut , SignedIn, SignInButton, SignOutButton ,UserButton} from '@clerk/clerk-react'
import toast from 'react-hot-toast'
const HomePage = () => {
    return(
        <>
            <button onClick={()=> toast.success("Success!")}> Click Me</button>
            <p>Home Page</p>
            <SignedOut>
                <SignInButton>
                    <button>Sign In</button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <SignOutButton/>
            </SignedIn>
        </>
    )
}
export default HomePage