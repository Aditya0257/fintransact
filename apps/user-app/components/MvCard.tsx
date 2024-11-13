"use client";

import { Button } from "@repo/ui/button";
import { getTransactionSummary } from "../lib/actions/getTransactionSummary";
import { useRef, useState } from "react";

export const MvCard = ({setGraphData}: {setGraphData?: any}) => {
  const [val, setVal] = useState<any>("");
  const [category, setCategory] = useState("");
  const [interval, setInterval] = useState("");

  const intervalValueRef = useRef(interval);
  return (
    <div>
      <h2>
        {val && val.length > 0 ? (
          val.map((item: any, index: number) => {
            switch (intervalValueRef.current) {
              case "daily":
                item.period = item.day;
                item.period_start = item.day_start;
                break;
              case "weekly":
                item.period = item.week;
                item.period_start = item.week_start;
                break;
              case "monthly":
                item.period = item.month;
                item.period_start = item.month_start;
                break;
              case "yearly":
                item.period = item.year;
                item.period_start = item.year_start;
                break;
            }

            return (
              <div key={index}>
                <p>period: {item.period.toString()}</p>
                <p>start_date: {item.period_start.toString()}</p>
                <p>amount: {Number(item.total_amount) / 100}</p>
              </div>
            );
          })
        ) : (
          <div>No data available</div>
        )}
      </h2>

      <div className="p-5 text-sm w-full rounded-lg">
        <input
          className="p-4"
          value={category}
          type="text"
          placeholder="category - onRamp, fromUser, toUser..."
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        />
      </div>

      <div className="p-5 text-sm w-full rounded-lg">
        <input
          className="p-4"
          value={interval}
          type="text"
          placeholder="interval - daily, weekly..."
          onChange={(e) => {
            setInterval(e.target.value);
          }}
        />
      </div>

      <Button
        onClick={async () => {
          intervalValueRef.current = interval;
          const res = await getTransactionSummary(category, interval);
          console.log("MV Data in res: ");
          console.log(res.transactionSummary);
          setVal(res.transactionSummary);
        }}
      >
        Test MV Data
      </Button>
    </div>
  );
};
