"use client"

import { useRouter } from "next/navigation"

export function ViewAllTransactionsButton() {
    const router = useRouter();

    return <div onClick={() => {
        router.push("/transactions");
    }} className="cursor-pointer mt-2 px-2 py-1.5 font-semibold rounded-lg text-base text-[#6d28d9] bg-[#ddd6fe] hover:bg-[#c4b5fd]">
        View All Transactions
    </div>
}