import { AllTransactions } from "../../../components/AllTransactions";

export default function TransactionsPage() {
  return (
    <div className="pt-4 flex flex-col h-full w-full px-2">
      <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
        Transactions
      </div>
      <AllTransactions />
    </div>
  );
}




