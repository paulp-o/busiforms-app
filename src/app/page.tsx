// Import the Image component from Next.js for optimized images
import Image from "next/image";

// Import authentication functions from a custom auth module
import { auth, signIn, signOut } from "@/auth";

// Define the Home component as the default export
export default function Home() {
  return (
    <div>
      {/* Main heading */}
      <h1>Next.js + TypeScript + Tailwind CSS</h1>

      {/* Display the Vercel logo using the Next.js Image component */}
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />

      {/* Render sign in and sign out buttons */}
      <SignIn />
      <SignOut />

      <br />

      {/* Render user information */}
      <UserInfo />
    </div>
  );
}

// Define an asynchronous function to fetch and display user information
async function UserInfo() {
  // Await the authentication session
  const session = await auth();

  // Conditionally render user information if the user is signed in, otherwise show "Not signed in"
  return session?.user ? (
    <div>
      <p>{session.user.email}</p>
      <p>{session.user.id}</p>
      <p>{session.user.name}</p>
    </div>
  ) : (
    <p>Not signed in</p>
  );
}

// Define the SignIn component
export function SignIn() {
  return (
    <form
      // Define an asynchronous action for the form submission
      action={async () => {
        "use server"; // Directive for server-side code
        await signIn(); // Call the signIn function from the auth module
      }}
    >
      {/* Sign In button */}
      <button type="submit">Sign In</button>
    </form>
  );
}

// Define the SignOut component
export function SignOut() {
  return (
    <form
      // Define an asynchronous action for the form submission
      action={async () => {
        "use server"; // Directive for server-side code
        await signOut(); // Call the signOut function from the auth module
      }}
    >
      {/* Sign Out button */}
      <button type="submit">Sign Out</button>
    </form>
  );
}
