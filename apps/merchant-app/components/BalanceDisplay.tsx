"use client";

import { useBalance } from "@repo/store/balance";

export function BalanceDisplay() {
  const balance = useBalance();

  return (
    <div className="text-red-400 text-3xl pt-4 pl-4">
      hi there, your curr balance is: {balance}
    </div>
  );
}

