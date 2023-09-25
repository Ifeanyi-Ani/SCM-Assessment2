import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import atm_abi from '../artifacts/contracts/Assessment.sol/Assessment.json';

export default function HomePage() {
  const INITIAL = {
    _to: '',
    amount: '',
    remark: '',
  };
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactions, setTransactions] = useState(undefined);
  const [depositAmt, setDepositAmt] = useState({
    to: '',
    amount: '',
    remark: '',
  });
  const [withdrawAmt, setWithdrawAmt] = useState({
    from: '',
    amount: '',
    remark: '',
  });
  const [trfForm, setTrfForm] = useState(INITIAL);

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: 'eth_accounts' });
      handleAccount(account);
    }
  };

  const handleAccount = account => {
    if (account) {
      console.log('Account connected: ', account);
      setAccount(account);
    } else {
      console.log('No account found');
    }
  };

  const connectAccount = async () => {
    try {
      if (!ethWallet) {
        alert('MetaMask wallet is required to connect');
        return;
      }

      const accounts = await ethWallet.request({
        method: 'eth_requestAccounts',
      });
      handleAccount(accounts);

      // once wallet is set we can get a reference to our deployed contract
      getATMContract();
    } catch (err) {
      console.log(err);
    }
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      const { to, amount, remark } = depositAmt;
      let tx = await atm.deposit(to, amount, remark);
      await tx.wait();
      getBalance();
      getTransactions();
    }
  };

  const transfer = async () => {
    try {
      if (atm) {
        const { _to, amount, remark } = trfForm;
        let tx = await atm.transfer(_to, amount, remark);
        await tx.wait();
        console.log(await atm.getTransactions());
        getBalance();
        getTransactions();
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getTransactions = async () => {
    if (atm) {
      console.log('Fetching transactions...');
      let tx = await atm.getTransactions();
      console.log('Fetched transactions:', tx);
      setTransactions(tx);
    }
  };

  const withdraw = async () => {
    if (atm) {
      const { from, amount, remark } = withdrawAmt;
      let tx = await atm.withdraw(from, amount, remark);
      await tx.wait();
      await getBalance();
      await getTransactions();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <div className="flex items-center w-full justify-center mt-4">
          <button
            onClick={connectAccount}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        </div>
      );
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <>
        <section className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Balance</h2>
            <p>Your balance: {balance}</p>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Send Transaction</h2>
          <div className="grid grid-cols-2 gap-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                transfer();
              }}
            >
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-600">
                  Recipient Address:
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full border p-2 rounded"
                  value={trfForm._to}
                  onChange={e =>
                    setTrfForm({ ...trfForm, _to: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-600">
                  Amount:
                </label>
                <input
                  type="number"
                  id="amount"
                  className="w-full border p-2 rounded"
                  value={trfForm.amount}
                  onChange={e =>
                    setTrfForm({ ...trfForm, amount: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="remark" className="block text-gray-600">
                  Remark:
                </label>
                <textarea
                  id="remark"
                  className="w-full border p-2 rounded"
                  rows="3"
                  value={trfForm.remark}
                  onChange={e =>
                    setTrfForm({ ...trfForm, remark: e.target.value })
                  }
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </form>
            <div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  deposit();
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="depositAmount"
                    className="block text-gray-600"
                  >
                    Deposit Amount:
                  </label>
                  <input
                    type="number"
                    id="depositAmount"
                    className="w-full border p-2 rounded"
                    required
                    value={depositAmt.amount}
                    onChange={e =>
                      setDepositAmt({
                        ...depositAmt,
                        amount: e.target.value,
                        to: contractAddress,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="remark" className="block text-gray-600">
                    Remark:
                  </label>
                  <textarea
                    id="remark"
                    className="w-full border p-2 rounded"
                    rows="3"
                    value={depositAmt.remark}
                    onChange={e =>
                      setDepositAmt({
                        ...depositAmt,
                        remark: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Deposit
                </button>
              </form>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  withdraw();
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="withdrawAmount"
                    className="block text-gray-600"
                  >
                    withdraw Amount:
                  </label>
                  <input
                    type="number"
                    id="withdrawAmount"
                    className="w-full border p-2 rounded"
                    required
                    value={withdrawAmt.amount}
                    onChange={e =>
                      setWithdrawAmt({
                        ...withdrawAmt,
                        amount: e.target.value,
                        from: contractAddress,
                      })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="remark" className="block text-gray-600">
                    Remark:
                  </label>
                  <textarea
                    id="remark"
                    className="w-full border p-2 rounded"
                    rows="3"
                    value={withdrawAmt.remark}
                    onChange={e =>
                      setWithdrawAmt({
                        ...withdrawAmt,
                        remark: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  withdraw
                </button>
              </form>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">From</th>
                  <th className="border px-4 py-2">To</th>
                  <th className="border px-4 py-2">Type</th>
                  <th className="border px-4 py-2">Remark</th>
                  <th className="border px-4 py-2">
                    Amount <br /> (hex)
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions ? (
                  [...transactions].reverse().map((transaction, idx) => (
                    <tr key={idx}>
                      <td className="border px-4 py-2">{idx + 1}</td>
                      <td className="border px-4 py-2">{transaction.sender}</td>
                      <td className="border px-4 py-2">
                        {transaction.receiver}
                      </td>
                      <td className="border px-4 py-2">
                        {transaction.transaction_type}
                      </td>
                      <td className="border px-4 py-2">{transaction.remark}</td>
                      <td className="border px-4 py-2">
                        {transaction.amount._hex}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Loading transactions...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (ethWallet) {
      getTransactions();
    }
  }, [ethWallet]);

  return (
    <div>
      <div className="bg-blue-500 p-4">
        <nav className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">ATM App</h1>
          <div className="space-x-4">
            <a className="text-white" href="#">
              Home
            </a>
            <a className="text-white" href="#">
              About
            </a>
            <a className="text-white" href="#">
              Contact
            </a>
          </div>
        </nav>
      </div>
      <main className="container mx-auto p-4 min-h-[80vh]">
        <section>
          <h1 className="text-blue-500 text-4xl text-center font-medium">
            Transaction management Platform, <br /> All in one place
          </h1>
        </section>
        {initUser()}
      </main>
      <footer className="bg-blue-500 p-4 mt-8">
        <div className="container mx-auto text-white text-center">
          &copy; {new Date().getFullYear()} Blockchain App
        </div>
      </footer>
    </div>
  );
}
