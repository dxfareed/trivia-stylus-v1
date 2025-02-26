"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import { useEffect, useState } from "react";
import {
  MockUSDC,TRIVIA_BASE_POOL
} from "@/sc/ca";
import tokenabi from "@/sc/tokenabi.json";
import TriviaABI from "@/sc/trivia.json";
import Web3 from "web3";
import { useRouter } from "next/navigation";
import {
  ref,
  set,
  database,
  get,
  push,
  update as firebaseUpdate,
  getDatabase,
} from "@/config/FirebaseConfig";
import {ethers} from "ethers"
import poolabi from "@/sc/stylus/poolabi";

const WinningPage = () => {
  let testbool = false;
  let testAddress = " ";
  let NEW_CONTRACT_TRIVIA = null;
  const router = useRouter();
  const account = useActiveAccount();
  const [amount, setAmount] = useState(null);
  const [isDepositSuccessful, setIsDepositSuccessful] = useState(false);

  const provider = "https://sepolia-rollup.arbitrum.io/rpc";
  const web3 = new Web3(provider);
  
  const dec = 10 ** 6;
  const [isChecking, setIsChecking] = useState(false);
  const [pendingButtonTrnx, setPendingButtonTrnx] = useState(false);
  const [rewardStatus, setRewardStatus] = useState("initial");
  const [balNum, setBalNum] = useState(0);
  const [quizCode, setQuizCode] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState("");

  useEffect(() => {
    const fetchQuizCode = async () => {
      if (!account?.address) return;
      const storedWalletAddress = account.address;
      console.log(storedWalletAddress);
      const db = getDatabase();
      const quizcodeRef = ref(db, `paid_quizcode/${storedWalletAddress}`);
      try {
        const snapshot = await get(quizcodeRef);
        if (snapshot.exists()) {
          const fetchedQuizCode = snapshot.val().quizCode;
          setQuizCode(fetchedQuizCode);
          console.log("Fetched Quiz Code:", fetchedQuizCode);
        } else {
          console.log("No quiz code found for this wallet address");
        }
      } catch (error) {
        console.error("Error fetching quiz code:", error);
      }
    };

    fetchQuizCode();
  }, [account?.address]);

  const onApproveClick = async (_amount) => {
  const createTrivia = async () => {
    setPendingButtonTrnx(true);
      try {
       const response = await fetch(process.env.NEXT_PUBLIC_CREATE_TRIVIA_CONTRACT, {
       method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          }
        });
        const data = await response.json();
        return data.newContractTriviaBase;
      }
      catch (err) {
        return  err;
      } 
  };
  const approveToken = async () => {
    setPendingButtonTrnx(true);
    setApprovalStatus("waiting for approval...");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(MockUSDC, tokenabi, signer);
      
      const approvalAmount = ethers.utils.parseUnits(_amount.toString(), 6);
      const approveTx = await tokenContract.approve(TRIVIA_BASE_POOL, approvalAmount);
      
      await approveTx.wait();
      setApprovalStatus("Token approved successfully!");
      return true;
    } catch (error) {
      setPendingButtonTrnx(false);
      setApprovalStatus("Token approval failed!");
      console.error("Error in token approval:", error);
      return false;
    }
  };
  
  const depositToPool = async () => {
    setPendingButtonTrnx(true);
    setApprovalStatus("waiting to transfer...");
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const poolContract = new ethers.Contract(TRIVIA_BASE_POOL, poolabi, signer);
        const depositAmount = ethers.utils.parseUnits(_amount.toString(), 6);
        const depositTx = await poolContract.deposit(depositAmount);
        await depositTx.wait();
        setIsDepositSuccessful(true);
        testbool = true;
        setApprovalStatus("Transfer successful!");
        console.log("Deposit successful ", isDepositSuccessful);
        return true;
      } catch (error) {
        console.error("Error in pool deposit:", error);
        setIsDepositSuccessful(false);
        setPendingButtonTrnx(true);
        setApprovalStatus("Transfer failed!");
        return false;
      }
    };
  
  
  //@u user approve token first
  await approveToken();
  await depositToPool();

  if (testbool) {
    console.log("Deposit successful rrght", testbool);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    testAddress = address;
    NEW_CONTRACT_TRIVIA = address;
    console.log(`admin confirm transaction sender address ${address}`);
  } 

   const BalanceCheck = async (contractAddress) => {
      console.log("balance check in logic: ", contractAddress);
      console.log("Deposit successful rrght 2", testbool);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(TRIVIA_BASE_POOL, poolabi, provider);
      try {
        const balance = await contract.getDeposit(contractAddress);
        let bal = Number(balance) / dec;
        setBalNum(bal);
        console.log("main function check balance: ", bal);
        return bal;
      } catch (e) {
        setBalNum(0);
        console.log("fail to fetch contract balc: ", e);
        return 0;
      }
    };
    const balance = await BalanceCheck(testAddress);

    if (balance >= 1) {
      setIsChecking(true);

      setRewardStatus("success");
      setPendingButtonTrnx(false);
      setIsChecking(false);

      const paymentDetails = {
        quizCode,
        timestamp: new Date().toISOString(),
        transactionDetails: {
          from: account.address,
          to: NEW_CONTRACT_TRIVIA,
          amount: _amount,
          token: "USDC",
          chainId: 84532,
          network: "Base Sepolia",
        },
        status: "completed",
      };

      const quizRef = ref(database, `quiz_staking/${quizCode}`);
      const quizcontractRef = ref(
        database,
        `paid_quizzes/${quizCode}/smartContract`
      );

      await firebaseUpdate(quizRef, paymentDetails);
      await firebaseUpdate(quizcontractRef, paymentDetails);

      console.log("Payment details logged:", paymentDetails);
      setIsChecking(false);
      router.push(`./paid_quizcode`);
    } else {
      console.log("contract was never created!", balance);
      setRewardStatus("failed");
    }
  };
  return (
    <>
      {account && (
        <div className="bg-gray-100 min-h-screen flex flex-col">
          <button className="bg-white text-gray-600 h-[72px] flex items-center justify-start mb-1 w-full md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-14 inline-block ml-4 md:ml-20 bg-white rounded-r-lg shadow-[2px_0px_0px_#DBE7FF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center justify-center flex-grow pt-47">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-96">
              <div className="bg-[#EDEBFF] rounded-t-lg p-4 mb-4 flex items-center justify-center">
                <Image
                  src="/icons/paid.s.png"
                  alt="Email Icon"
                  width={19}
                  height={12}
                />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4 text-reward">
                {rewardStatus === "initial" && <div>Set a Reward</div>}
                {rewardStatus === "failed" && (
                  <div className="text-red-500">Transaction Failed</div>
                )}
                {rewardStatus === "success" && (
                  <div className="text-green-500">Successful Transaction</div>
                )}
              </h2>
              <p className="text-gray-700 text-center mb-6 text-reward">
                Reward goes to the winner of the game (USDC)
              </p>
              <input
                type="text"
                pattern="[0-9]*\.?[0-9]*"
                placeholder="Enter amount in USDC"
                className="bg-white p-3 rounded-md w-full mb-4 border border-gray-300"
                value={amount}
                onChange={(e) => {
                  //@ts-ignore
                  setAmount(Number(e.target.value));
                }}
              />
              {approvalStatus && (
                <p className="text-green-500 text-sm text-center mb-4">{approvalStatus}</p>
              )}
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => onApproveClick(amount)}
                    /* disabled={isPending} */
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {pendingButtonTrnx ? "Processing..." : "Stake"}
                  </button>
                  {isChecking && (
                    <div className="mt-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Confirming payment...</p>
                    </div>
                  )}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WinningPage;
