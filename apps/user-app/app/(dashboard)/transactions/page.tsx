"use client";

import { useState } from "react";
import { AllTransactions } from "../../../components/AllTransactions";

export enum TransactionType {
  "OnRamp",
  "Peer2Peer",
}

export default function TransactionsPage() {
  const [selectedType, setSelectedType] = useState<TransactionType>(
    TransactionType.OnRamp,
  );

  return (
    <div className="pt-4 flex flex-col h-full w-full px-2">
      <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
        Transactions
      </div>
      <div className="flex gap-x-4 mt-3">
        <div
          onClick={() => {
            setSelectedType(TransactionType.OnRamp);
          }}
          className={`cursor-pointer ${selectedType === TransactionType.OnRamp ? "bg-white" : "bg-[#ebe6e6]"} hover:bg-sky-50 text-sm font-semibold py-2 px-3 rounded-full text-[#1c1917]`}
        >
          OnRamp
        </div>
        <div
          onClick={() => {
            setSelectedType(TransactionType.Peer2Peer);
          }}
          className={`cursor-pointer ${selectedType === TransactionType.Peer2Peer ? "bg-white" : "bg-[#ebe6e6]"} hover:bg-sky-50 text-sm font-semibold py-2 px-3 rounded-full text-[#1c1917]`}
        >
          Peer2Peer
        </div>
      </div>
      <AllTransactions
        type={
          selectedType === TransactionType.OnRamp
            ? TransactionType.OnRamp
            : TransactionType.Peer2Peer
        }
      />
    </div>
  );
}
