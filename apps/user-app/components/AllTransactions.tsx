"use client"

import { useEffect, useState } from "react";
import { Transactions } from "./onRampTransactionsCard";
import { getPageTransactions } from "../lib/actions/getPageTransactions";
import { PaginationControls } from "./PaginationControls";

const transactionsPerPage = 10;

export function AllTransactions() {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchTransactions(page: number, transactionsPerPage: number) {
    const response = await getPageTransactions(page, transactionsPerPage);
    setTransactions(response.transactions);
  }

  useEffect(() => {
    const loadTransactions = async () => {

      setLoading(true);
      try {
        await fetchTransactions(currentPage, transactionsPerPage);
      } catch (e) {
        console.log(e);
        // alert(e);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();

  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (!transactions.length) {
    return <div>No Transactions</div>;
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }


  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const displayedTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div>
      <div className="pt-8">
        {displayedTransactions.map((trnsc) => (
          <div className="flex justify-between pb-2 px-2 border-b rounded-md  border-gray-300 mb-3 ">
            <div className="flex flex-col justify-center gap-y-1">
              <div className="text-sm">From {trnsc.provider}</div>
              <div className="text-slate-600 text-xs">
                Received on {trnsc.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-y-1">
              <div>+ Rs {trnsc.amount / 100}</div>
              <div className="text-xs text-right">{trnsc.status}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-5 left-1/2 z-50 ">
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}