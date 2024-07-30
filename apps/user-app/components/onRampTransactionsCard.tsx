"use client";

import { Card } from "@repo/ui/card";
import { RampStatus } from "@prisma/client";
import { ViewAllTransactionsButton } from "./ViewAllTransactionsButton";
import { useEffect, useState } from "react";
import { getOnRampRecentTransactions } from "../lib/actions/getOnRampRecentTransactions";

export interface Transactions {
  startTime: Date;
  amount: number;
  provider: string;
  status: RampStatus;
}

export const OnRampTransactionsCard = () => {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRecentTransactions() {
    const response = await getOnRampRecentTransactions();
    if (response?.transactions) {
      setTransactions(response.transactions);
    }
    // console.log("Transactions: ", response.transactions);
  }

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        await fetchRecentTransactions();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="py-8 text-center">No Recent transactions</div>
      </Card>
    );
  }

  const maxTransactionsToShow = 6;
  const displayedTransactions = transactions.slice(0, maxTransactionsToShow);
  const showViewAllTx = transactions.length > maxTransactionsToShow;

  return (
    <Card title="Recent Transactions">
      <div className="pt-2  ">
        {displayedTransactions.map((trnsc) => (
          <div className="flex justify-between pb-1 px-1 border-b rounded-md  border-gray-300 mb-2 ">
            <div>
              <div className="text-sm">From {trnsc.provider}</div>
              <div className="text-slate-600 text-xs">
                Received on {trnsc.startTime.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div>+ Rs {trnsc.amount / 100}</div>
              <div className="text-xs text-right">{trnsc.status}</div>
            </div>
          </div>
        ))}
      </div>
      {showViewAllTx && (
        <div className="flex justify-center">
          <ViewAllTransactionsButton />
        </div>
      )}
    </Card>
  );
};
