"use client";

import { useState } from "react";
import { startOnRampTransaction } from "../lib/actions/startOnRampTransaction";
import { TextInput } from "@repo/ui/textinput";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Select } from "@repo/ui/select";

const SUPPORTED_BANKS = [
  {
    id: 1,
    name: "TestBank",
    href: "http://localhost:5173/netbanking",
  },
  {
    id: 2,
    name: "HDFC",
    href: "https://netbanking.hdfcbank.com",
  },
  {
    id: 3,
    name: "Axis",
    href: "https://www.axisbank.com/",
  },
  {
    id: 4,
    name: "ICICI",
    href: "https://www.icicibank.com/",
  },
];

export function AddMoneyCard() {
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState("TestBank");
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.href);

  function handleInputChange(value: number) {
    setAmount(value);
  }

  async function handleAddMoneyClick() {
    try {
      const res = await startOnRampTransaction(provider, Number(amount));
      const href_url = redirectUrl;
      // console.log(res);
      if (!res.batoken) {
        console.log("no batoken returned");
      } else {
        console.log(res.batoken);
      }

      window.location.href = `${href_url}?batoken=${res.batoken}`;
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  return (
    <Card title="Add Money">
      <TextInput
        label="Amount"
        placeholder="Amount"
        value={amount}
        onChangeParent={handleInputChange}
      />
      <div className="text-sm font-medium text-gray-900">Bank</div>
      <Select
        options={SUPPORTED_BANKS.map(function (bank) {
          return { id: bank.id, key: bank.name, value: bank.name };
        })}
        onSelectParent={(value) => {
          setRedirectUrl(
            SUPPORTED_BANKS.find((x) => x.name === value)?.href || "",
          );
          setProvider(
            SUPPORTED_BANKS.find((x) => x.name === value)?.name || "TestBank",
          );
        }}
      />

      <div className="flex justify-center pt-6 text-base">
        <Button onClick={handleAddMoneyClick}>Add Money</Button>
      </div>
    </Card>
  );
}
