"use client"

import { useRouter } from "next/navigation"
import { TransactionType } from "./AllTransactions";

export function ViewAllTransactionsButton({ isP2P }: { isP2P?: boolean }) {
    const router = useRouter();

    return <div onClick={() => {

        if (isP2P) {
            const query = new URLSearchParams({ initialTrnxType: TransactionType.Peer2Peer }).toString();
            router.push(`/transactions?${query}`);
        } else {
            router.push("/transactions");
        }
    }} className="cursor-pointer mt-2 px-2 py-1.5 font-semibold rounded-lg text-base text-[#6d28d9] bg-[#ddd6fe] hover:bg-[#c4b5fd]">
        View All Transactions
    </div>
}