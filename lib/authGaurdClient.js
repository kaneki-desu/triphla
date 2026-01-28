
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
export async function LoginIsRequired(){
  if( typeof window !== "undefined"){
    const session = useSession();
    const router=useRouter();
    if(!session)return router.push("/");
  }
}
