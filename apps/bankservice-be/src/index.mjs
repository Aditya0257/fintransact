import express from "express";
import cors from "cors";
import "dotenv/config";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());
const port = 4008;

async function sendWebhookRequest(
    payload,
    retries = 5,
    delay = 300000,
  ) {
    // delay in mili seconds -> 300000 ms = 5 minutes
    try {

      
      const res = await axios.post(
        `${process.env.WEBHOOK_BACKEND_URL}/onRampBankWebhook`,
        {
          onRampToken: payload.onRampToken,
          amount: payload.amount,
          userId: payload.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            bwsToken: `${process.env.BWS_TOKEN_VAL}`,
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

app.post("/sendWebhookRequest", (req, res) => {
    const {payload} = req.body;
    sendWebhookRequest(payload);

    console.log("Request came from bankservice-app to send confirmation request to bank-webhook service for onRamp payment.");

    res.status(200).json({
        "message": "Called the `sendWebhookRequest` fn.",
        "success": true,
    })
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
  