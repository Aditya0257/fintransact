import { BalanceCard } from "../../../components/BalanceCard";
import P2PTransferCard from "../../../components/P2PTransferCard";
import { RecentP2PTransactionsCard } from "../../../components/RecentP2PTransactionsCard";

export default function p2pTransferPage() {

  return (
    <div className="pt-4 flex flex-col h-full w-full px-2">
      <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
        p2p Transfer
      </div>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 max-h-fit ">
        <div className="flex flex-col">
          <P2PTransferCard />
        </div>
        <div className="flex flex-col gap-y-2">
          <div>
            <BalanceCard />
          </div>
          <div>
            <RecentP2PTransactionsCard />
          </div>
        </div>
      </div>
    </div>);
}
