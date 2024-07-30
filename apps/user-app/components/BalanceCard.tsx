import { Card } from "@repo/ui/card";
import { getUserBalance } from "../lib/actions/getUserBalance";

export const BalanceCard = async () => {
  const response = await getUserBalance();
  const totalBalance = response.totalBalance;
  const lockedBalance = response.lockedBalance;

  return (
    <Card title="Balance">
      <div className="flex flex-col gap-y-3">
        <div className="flex py-2 border-b border-gray-300">
          <div className="flex-grow">Unlocked Balance</div>
          <div>{totalBalance - lockedBalance} INR</div>
        </div>

        <div className="flex pb-2 border-b border-gray-300">
          <div className="flex-grow">Total Locked Balance</div>
          <div>{lockedBalance} INR</div>
        </div>
        <div className="flex pb-2 border-b border-gray-300">
          <div className="flex-grow">Total Balance</div>
          <div>{totalBalance} INR</div>
        </div>
      </div>
    </Card>
  );
};
