import { AddMoneyCard } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactionsCard } from "../../../components/onRampTransactionsCard";

export default function () {
  return (
    <div className="pt-4 flex flex-col h-full w-full px-2">
      <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
        onRamp Transfer
      </div>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 max-h-fit ">
        <div className="flex flex-col">
          <AddMoneyCard />
        </div>
        <div className="flex flex-col gap-y-2">
          <div>
            <BalanceCard />
          </div>
          <div>
            <OnRampTransactionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
