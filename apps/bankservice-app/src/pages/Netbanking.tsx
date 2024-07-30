import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BlueCard } from "../components/BlueCard";
import { ImportantNoteCard } from "../components/ImportantNodeCard";
import { BankLinksSideCard } from "../components/BankLinkSideCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface jwtPayload {
  userId: string;
  name: string;
  amount: number;
  onRampToken: string;
}

function useQuery() {
  const { search } = useLocation();

  const query = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  return query;
}

function isJwtPayload(object: unknown): object is jwtPayload {
  if (typeof object === "object" && object !== null) {
    const payload = object as jwtPayload;
    return (
      typeof payload.userId === "string" &&
      typeof payload.name === "string" &&
      typeof payload.amount === "number" &&
      typeof payload.onRampToken === "string"
    );
  }
  return false;
}

export const Netbanking = () => {
  const query = useQuery();
  const [payload, setPayload] = useState<jwtPayload | null>(null);
  // const navigate = useNavigate();

  const batoken = query.get("batoken");

  useEffect(() => {
    if (batoken) {
      try {
        // decode the jwt token
        const decoded = jwtDecode(batoken);
        if (!decoded) throw new Error("no payload found");
        else if (decoded && typeof decoded === "string")
          throw new Error(
            "payload was found in string format, not in jwtPayload type",
          );

        if (isJwtPayload(decoded)) {
          console.log("Decoded Token:", decoded);
          setPayload(decoded);
        } else {
          console.error("Failed to decode JWT token or invalid payload");
        }
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }, [batoken]);

  return (
    <div className="flex flex-col w-screen font-sans font-light ">
      <div className="flex w-full text-4xl bg-slate-100 py-4 border-b border-gray-200 mb-2 justify-center ">
        Welcome to TestNetBanking
      </div>
      <div className="flex w-full justify-center ">
        <BankCard payload={payload} />
      </div>
    </div>
  );
};

async function sendWebhookRequest(
  payload: jwtPayload,
  retries = 5,
  delay = 300000,
) {
  // delay in mili seconds -> 300000 ms = 5 minutes
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_WEBHOOK_BACKEND_URL}/onRampBankWebhook`,
      {
        onRampToken: payload.onRampToken,
        amount: payload.amount,
        userId: payload.userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          bwsToken: `${import.meta.env.VITE_BWS_TOKEN_VAL}`,
        },
      },
    );

    if (
      res.data.success === true &&
      (res.data.message === "Captured" ||
        res.data.message === "Already Captured")
    ) {
      // stop sending retrial post requests for payment confirmation to webhook, as it already received
      console.log("Payment confirmation successful:", res.data.message);
      // Stop retrying
      return true;
    } else {
      // resend the retrial request after some time -> throw to catch block for recursive calls
      throw new Error("Payment confirmation failed");
    }
  } catch (e) {
    console.error("Error occurred:", e);
    if (retries > 0) {
      setTimeout(() => {
        sendWebhookRequest(payload, retries - 1, delay);
      }, delay);
    } else {
      console.log("All retries failed. Initiating bank refunding simulation.");
      console.log(
        `Refunding ${payload.name} of userId: ${payload.userId} with ${payload.amount}, since payment confirmation to application's webhook failed after 5 retries!`,
      );
    }
  }
}

function BankCard({ payload }: { payload: jwtPayload | null }) {
  const [name, setName] = useState("");
  if (!payload) {
    return <div>NO PAYLOAD, ERROR!</div>;
  }
  return (
    <div className="flex w-3/5 flex-col mt-1.5 border border-gray-200 px-10 py-5">
      <div className="flex justify-start text-xl mb-2">
        Onramping Amount to be Paid: Rs {payload.amount}
      </div>

      <div className="flex w-11/12 pt-2 justify-between">
        <div className="flex gap-x-7">
          <div className="flex flex-col justify-start pt-2">
            Customer ID/ User ID
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Your Name"
              required
            />

            <button
              type="button"
              onClick={async () => {
                const username = name;
                if (username === payload.name) {
                  // redirect back to fintransact user-end application
                  window.location.href = `${import.meta.env.VITE_FINTRANSACT_FRONTEND_URL}/transfer`;

                  // send payment confirmation request to bank-server
                  await new Promise((resolve) => setTimeout(resolve, 100));

                  // then bank server will send confirmation request to our webhook server => which we are
                  // simulating from here -> since this is simulation of a real transacting bank server, but we dont
                  // have any bank server right now.

                  // TODO: SIMULATE BANK SERVER HITTING WEBHOOK SERVER -> And waiting to recieve `Capture` message in response
                  // WHY? because, if it doesnt recieve Capture message, then Bank Server retries after some time, to
                  // again send the confirmation to webhook server in case webhook server was down for some time

                  // Bank Server retries for sometime in case of failing requests, else refunds the user account -> when onRamp fails
                  sendWebhookRequest(payload);
                } else {
                  alert("Wrong username");
                }
              }}
              className="mt-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2 "
            >
              CONTINUE
            </button>
          </div>
        </div>
        <div>
          <img
            className="h-24 w-36 object-fill "
            src="https://crdms.images.consumerreports.org/f_auto,w_1200/prod/products/cr/models/401082-security-suites-norton-360-deluxe-2020-10012499.png"
          />
        </div>
      </div>

      <div className="flex text-sm">
        <BlueCard />
        <BankLinksSideCard />
      </div>

      <ImportantNoteCard />
    </div>
  );
}
