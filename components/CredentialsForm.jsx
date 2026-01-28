import { signIn } from 'next-auth/react';
import { useState } from 'react'

const CredentialsForm = () => {    
    const [loading, setLoading] = useState(false)
    const [err, setError]=useState(null);
    const [isRegistering,setIsRegistering]= useState(true);
    const handleSubmit =async (e)=>{
        e.preventDefault();
        console.log(e.target.form);
        setLoading(true)
        const formData= new FormData(e.currentTarget);
        // if(isRegistering==false){
        const res = await signIn("credentials",{
            name:isRegistering? formData.get("name"):null,
            email:formData.get("email"),
            password:formData.get("password"),
            redirect:false,
            callbackUrl:'/learn'
        })
        if(res.error)
            setError(isRegistering?"Registration Failed" :"Signing Failed , Please try again")
    setLoading(false);
    }
  return (
    <>  {err && (
        <p className="mb-3 text-center rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
          {err}
        </p>
      )}
        <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegistering && (
                <input name='name' type="text" placeholder="Name" className="w-full rounded-lg border px-3 py-2"/>
            )}
            <input name='email' type="email" placeholder="Email" className="w-full rounded-lg border px-3 py-2"
            />
            <input
              name='password' type="password" placeholder="Password" className="w-full rounded-lg border px-3 py-2"
            />
            <p className="mt-4 text-center text-sm text-gray-600">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <button  className="text-blue-600 underline ml-1 cursor-pointer"  
                type='button'
                onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? "Login" : "Register"}
                </button>
            </p>
            <button type="submit" className="w-full rounded-lg bg-black py-2 text-white cursor-pointer" >
                {loading?
                    (isRegistering ? "Registering ...":" Signing In ..." ):
                    (isRegistering ? "Register":"Login" )
                    }
            </button>            
        </form>
    </>
  )
}

export default CredentialsForm