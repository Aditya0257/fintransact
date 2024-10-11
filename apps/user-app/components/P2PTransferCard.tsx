"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { startP2PTransfer } from "../lib/actions/startP2PTransfer";
import { useSession } from "next-auth/react";

export default function P2PTransferCard({ onTransaction }: any) {
    const [amount, setAmount] = useState(0);
    const [toNumber, setToNumber] = useState("");
    const session = useSession(); // clientSideSession
    const userNumber = session?.data?.user?.number;
    // console.log("user number: ", userNumber);


    function handleAmountInputChange(value: number) {
        setAmount(value);
    }

    function handleToNumberInputChange(value: string) {
        setToNumber(value);
    }

    async function handleTransferMoneyClick() {
        try {
            if(Number(userNumber) === Number(toNumber)) {
                throw "Transfering money to the same account not allowed!";
            }
            const res = await startP2PTransfer(toNumber.toString(), Number(amount));

        } catch (error) {
            console.error("Error occurred while doing p2p Transfer:", error);
        } finally {
            setAmount(0);
            setToNumber("");
            // Once the transaction is completed, notifying the parent component
            onTransaction();
        }
    }

    return (
        <Card title="Add Money">
            <TextInput
                label="Number"
                placeholder="Number"
                value={toNumber}
                onChangeParent={handleToNumberInputChange}
            />

            <TextInput
                label="Amount"
                placeholder="Amount"
                value={amount}
                onChangeParent={handleAmountInputChange}
            />

            <div className="flex justify-center pt-2 text-base">
                <Button onClick={handleTransferMoneyClick}>Transfer</Button>
            </div>
        </Card>
    );
}