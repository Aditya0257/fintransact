"use client";

import { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
// import { MvCard } from "./MvCard";
import { getTransactionSummary } from "../lib/actions/getTransactionSummary";


enum TnxInterval {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}

enum TnxCategory {
    ON_RAMP = "onRamp",
    FROM_USER = "fromUser",
    TO_USER = "toUser"
}

export const Graph = () => {

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <LineChartComponent interval={TnxInterval.DAILY} />
                <LineChartComponent interval={TnxInterval.WEEKLY} />
            </div>
            <div className="flex justify-between">
                <LineChartComponent interval={TnxInterval.MONTHLY} />
                <LineChartComponent interval={TnxInterval.YEARLY} />
            </div>
            {/* <MvCard /> */}
        </div>
    );
};

const SUPPORTED_CATEGORIES = [
    {
        id: 1,
        name: TnxCategory.ON_RAMP,
    },
    {
        id: 2,
        name: TnxCategory.FROM_USER,
    },
    {
        id: 3,
        name: TnxCategory.TO_USER,
    },
];

function LineChartComponent({ interval }: { interval: TnxInterval }) {
    const [category, setCategory] = useState<TnxCategory>(TnxCategory.ON_RAMP);
    const [graphData, setGraphData] = useState<any[]>([]);


    function formatDate(dateString: string) {
        // Step 1: Convert the date string to a Date object
        const date = new Date(dateString);

        // Step 2: Extract the day, month, and year, and format as needed
        const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero
        const year = String(date.getFullYear()).slice(-2); // Last two digits of year

        // Step 3: Combine into "DD/MM/YY" format
        const formattedDate = `${day}/${month}/${year}`;

        // console.log(formattedDate); // Output: "01/01/22"
        return formattedDate;
    }



    useEffect(() => {
        // api call to fetch transaction summary for set category as per the interval
        const myFn = async () => {
            try {
                const res = await getTransactionSummary(category, interval);
                // console.log(res.transactionSummary);
                if (!res.transactionSummary) {
                    console.log("No data!");
                } else {
                    let tnxSummary = res.transactionSummary.map(tnx => {
                        let amount = Number(tnx.total_amount);
                        let actualAmount = amount / 100;

                        if (interval === TnxInterval.DAILY) {
                            let date = formatDate(tnx.day_start.toString());
                            return {
                                ...tnx,
                                day: date,
                                total_amount: Number(actualAmount)
                            }
                        }
                        return {
                            ...tnx,
                            total_amount: Number(actualAmount)
                        };
                    })
                    console.log(`Fetching Tnx Summary of Category: ${category} and Interval: ${interval}.`);
                    // console.log(tnxSummary);
                    setGraphData(tnxSummary);
                }
            } catch (error) {
                console.log(error);
                console.log(`Could Not fetch Transaction Summary of Category: ${category} and Interval: ${interval}.`);
            }
        }

        myFn();

    }, [category, interval]);


    let name = 'day';
    let xaxisName = 'Day';
    switch (interval) {
        case "daily":
            name = 'day';
            xaxisName = 'Day';
            break;
        case "weekly":
            name = 'week';
            xaxisName = 'Week';
            break;
        case "monthly":
            name = 'month';
            xaxisName = 'Month';
            break;
        case "yearly":
            name = 'year';
            xaxisName = 'Year';
            break;
    }

    return (
        <div className="flex flex-col mt-5 mb-5">
            <div className="flex justify-between ">
                <div className="font-md rounded-lg text-xl text-[#6d28d9]">
                    {interval} Transactions
                </div>
                <div className="flex w-[32%] mr-5  ">
                    <Select
                        options={SUPPORTED_CATEGORIES.map(function (choice) {
                            return { id: choice.id, key: choice.name, value: choice.name };
                        })}
                        onSelectParent={function (value: string): void {
                            setCategory(
                                SUPPORTED_CATEGORIES.find((x) => {
                                    if (x.name === value) return true;
                                    else return false;
                                })?.name || TnxCategory.ON_RAMP
                            );
                        }}
                    />
                </div>
            </div>

            <LineChart width={650} height={280} data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={name} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey={xaxisName} stroke="#8884d8" />

            </LineChart>
        </div>
    );
}

function Select({
    options,
    onSelectParent,
}: {
    options: { id: number; key: string; value: string }[];
    onSelectParent: (value: string) => void;
}) {
    return (
        <select
            onChange={(e) => {
                onSelectParent(e.target.value);
            }}
            className="mr-4 mx-2 w-[95%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  "
        >


            {options.map(function (op) {
                return (
                    <option key={op.id} value={op.key}>
                        {op.value}
                    </option>
                );
            })}
        </select>
    );
}
