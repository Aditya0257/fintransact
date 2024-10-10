"use client";

import { useEffect, useState } from "react";
import { OnRampTransactionType } from "./onRampTransactionsCard";
import { getPageOnRampTransactions } from "../lib/actions/getPageOnRampTransactions";
import { PaginationControls } from "./PaginationControls";
import { getPageP2PTransactions } from "../lib/actions/getPageP2PTransactions";
import { useSession } from "next-auth/react";
// import { P2PTransactionType } from "./RecentP2PTransactionsCard";

export enum TransactionType {
  OnRamp = "OnRamp",
  Peer2Peer = "Peer2Peer",
}

export interface P2PMappedTransactionType {
  amount: number;
  timestamp: Date;
  fromUserId: number;
  fromUserName: string;
  fromUserContactNo: string;
  toUserId: number;
  toUserName: string;
  toUserContactNo: string;
}


const transactionsPerPage = 9;

export function AllTransactions({ type }: { type: TransactionType }) {

  const [onRampTransactions, setOnRampTransactions] = useState<OnRampTransactionType[]>([]);
  const [p2pTransactions, setP2PTransactions] = useState<P2PMappedTransactionType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const session = useSession(); // clientSideSession
  const userId = session?.data?.user?.id;

  const transactions = type === TransactionType.OnRamp ? onRampTransactions : p2pTransactions;

  async function fetchTransactions(page: number, transactionsPerPage: number) {
    let response;
    /*
      NOTE: Currently, when calling the getPageOnRampTransactions or getPageP2PTransactions 
      server action with the page and transactionsPerPage parameters, we are not optimizing 
      the database call. Instead, we are retrieving all transactions and then slicing them 
      in the application. This approach does not reduce the database load. However, we are 
      passing these parameters to allow for easier scaling of the application in the future 
      if we decide to implement this optimization.
    */
    if (type === TransactionType.OnRamp) {
      response = await getPageOnRampTransactions(page, transactionsPerPage);
      if (response?.transactions) {
        setOnRampTransactions(response.transactions);
      }
    } else if (type === TransactionType.Peer2Peer) {
      response = await getPageP2PTransactions(page, transactionsPerPage);
      if (response?.transactions) {
        setP2PTransactions(response.transactions);
      }
    }

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
  }, [currentPage, type]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transactions.length) {
    return <div className="mt-5">No Transactions</div>;
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
      <div className="mt-5">
        {displayedTransactions.map((trnsc, index) => (
          <div key={index} >
            {type === TransactionType.OnRamp ?
              (
                <div className="flex justify-between pb-2 px-2 border-b rounded-md  border-gray-300 mb-3 ">
                  <div className="flex flex-col justify-center gap-y-1">
                    <div className="text-sm">From {(trnsc as OnRampTransactionType).provider}</div>
                    <div className="text-slate-600 text-xs">
                      Received on {(trnsc as OnRampTransactionType).startTime.toString()}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-y-1">
                    <div>+ Rs {(trnsc as OnRampTransactionType).amount / 100}</div>
                    <div className="text-xs text-right">{(trnsc as OnRampTransactionType).status}</div>
                  </div>
                </div>
              )
              :
              (
                Number((trnsc as P2PMappedTransactionType).toUserId) === Number(userId) ? (
                  <div className="flex justify-between pb-2 px-2 border-b rounded-md  border-gray-300 mb-3 ">
                    <div className="flex flex-col justify-center gap-y-1">

                      <div className="text-sm">Received INR</div>
                      <div className="text-slate-600 text-xs">
                        From: {(trnsc as P2PMappedTransactionType).fromUserName} ({(trnsc as P2PMappedTransactionType).fromUserContactNo})
                      </div>

                      <div className="text-slate-600 text-xs">
                        Date: {(trnsc as P2PMappedTransactionType).timestamp
                          ? new Date((trnsc as P2PMappedTransactionType).timestamp).toLocaleString()
                          : "N/A"}
                      </div>



                    </div>

                    <div className="flex flex-col justify-center gap-y-1">
                      + Rs {(trnsc as P2PMappedTransactionType).amount / 100}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between pb-2 px-2 border-b rounded-md   border-gray-300 mb-3 ">
                    <div className="flex flex-col justify-center">

                      <div className="text-sm">Sent INR</div>
                      <div className="text-slate-600 text-xs">
                        To: {(trnsc as P2PMappedTransactionType).toUserName} ({(trnsc as P2PMappedTransactionType).toUserContactNo})
                      </div>

                      <div className="text-slate-600 text-xs">
                        Date: {(trnsc as P2PMappedTransactionType).timestamp
                          ? new Date((trnsc as P2PMappedTransactionType).timestamp).toLocaleString()
                          : "N/A"}
                      </div>

                    </div>
                    <div className="flex flex-col justify-center">
                      - Rs {(trnsc as P2PMappedTransactionType).amount / 100}
                    </div>


                  </div>
                )
              )}
          </div>
        ))}
      </div>
      <div className="fixed bottom-5 left-1/2 z-50 ">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
