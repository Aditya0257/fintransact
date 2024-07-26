"use client";

import { startOnRampTransaction } from "../../../lib/actions/startOnRampTransaction";

export default function () {
  async function handleClick() {
    try {
      const res = await startOnRampTransaction("HDFC", 300);
      const href_url = "http://localhost:5173/netbanking";
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
    <div className="flex flex-col">
      <div>Dashboard</div>
      <div>
        <button type="button" onClick={handleClick}>
          StartOnRamp
        </button>
      </div>
    </div>
  );
}
