export const BankLinksSideCard = () => {
  return (
    <div className="flex flex-col py-4 ml-10 pl-5 flex-grow ">
      <div className="font-medium ">Understanding Real NetBanking Pages</div>
      <div>This demo simulates a transaction NetBanking web page.</div>
      <div>For comparison, visit these actual bank websites:</div>
      <ul className="list-disc text-blue-800">
        <li>
          <a href="https://netbanking.hdfcbank.com/">HDFC Bank NetBanking</a>
        </li>
        <li>
          <a href="https://retail.axisbank.co.in/">Axis Bank NetBanking</a>
        </li>
        <li>
          <a href="https://netbanking.kotak.com/">Kotak Bank NetBanking</a>
        </li>
      </ul>
      <div>
        <span className="font-medium">Note:</span> These links are for
        educational purposes only. Always access your bank through official
        channels.
      </div>
    </div>
  );
};
