import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { Graph } from "../../../components/Graph";

export default async function () {
  const session = await getServerSession(authOptions);
  const time = new Date();
  const hours = time.getHours();

  const user = session?.user;

  return (
    <div className="pt-4 flex flex-col h-full w-full px-2">
      <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
        Good {hours < 12 ? "Morning" : hours >= 12 && hours <= 17 ? "Afternoon" : "Evening"}, {user?.name}
      </div>
      <div className="flex ">
        
        <Graph />
      </div>

    </div>
  );
}
