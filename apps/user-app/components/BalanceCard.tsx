"use client"

import { Card } from "@repo/ui/card";
import { getUserBalance } from "../lib/actions/getUserBalance";
import { useEffect, useState } from "react";

export const BalanceCard = ({ newTransaction }: { newTransaction?: any }) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);  // Using state for total balance
  const [lockedBalance, setLockedBalance] = useState<number>(0); 


  useEffect(() => {

    const callUserBalanceFn = async () => {
      try {
        const response = await getUserBalance();
        setTotalBalance(response?.totalBalance ?? 0);
        setLockedBalance(response?.lockedBalance ?? 0);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setTotalBalance(0);
        setLockedBalance(0);
      }
    };

    callUserBalanceFn();

  }, [newTransaction])

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
