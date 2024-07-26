export const ImportantNoteCard = () => {
  return (
    <div className="flex flex-col text-[15px]">
      <div className="text-lg font-medium">Important Note: </div>
      <ul className="flex flex-col list-disc">
        <li>
          This is a demonstration interface for the FinTransact application. No
          real financial transactions will occur. Use this simulation to
          understand the flow of secure online banking integrations.
        </li>
        <li>
          Clicking 'Continue' here represents completing the full authentication
          process in a real-world scenario. This simulates the process where you
          would visit your actual bank provider's (e.g. HDFC, Axis) netbanking
          pages, enter your user ID and credentials, and authorize payment for
          the displayed amount. After this step, our mock bank server will
          contact a webhook to continue the FinTransact workflow, simulating how
          you would be redirected back to the original application after
          completing the banking process.
        </li>
        <li>
          Security Notice: In an actual banking scenario, you would see
          additional security measures such as two-factor authentication, SSL
          encryption indicators, and bank-specific security features. Always
          verify you're on your bank's official website before entering
          sensitive information.
        </li>
        <li>
          Did you know? When you make a payment through a fintech app in real
          life, complex systems work behind the scenes to securely transfer
          information between the app, your bank, and payment networks. This
          demo simplifies that process to illustrate the basic flow.
        </li>
      </ul>
    </div>
  );
};
