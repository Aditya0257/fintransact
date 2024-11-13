import { Auth } from "../../components/Auth";
import { Quote } from "../../components/Quote";


export default function SignInPage() {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div>
        <Auth/>
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
}
