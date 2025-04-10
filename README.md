## TriviaBase

TriviaBase is a Q & A platform, which can be used at Events, Communities (online & offline), Social groups to bring the audience together to learn, network, and also get Rewards from participating.

```js
// Deployed contracts on Arbiscan:
const TRIVIA_BASE_TOKEN = "0xf0A806C38968DFfc952b6bEC73D7f9C669F22bC1";
// https://sepolia.arbiscan.io/address/0xf0A806C38968DFfc952b6bEC73D7f9C669F22bC1
const TRIVIA_BASE = "0x99FF0429a32a7cabfDC31918C27C1D685F7407aa";
// https://sepolia.arbiscan.io/address/0x99FF0429a32a7cabfDC31918C27C1D685F7407aa

```

### Built with:

| **Tech**                  | **Used for**                                                                                                                                                              |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Next.js**               | Used for the [frontend](https://github.com/dxfareed/trivia-stylus-v1/tree/master/src/app) to create a fast, responsive, and user-friendly interface.                  |
| **Ethers.js**             | Connects and interacts with the smart contract, enabling seamless communication with blockchain networks.                                                                |
| **Node.js**               | Manages server-side logic and API endpoints on the backend, ensuring efficient handling of requests and data processing.                                                  |
| **Arbitrum Stylus (Rust)**| Utilized as the smart contract language for writing secure and efficient contracts, as shown in the [Smart contract](https://github.com/dxfareed/trivia-stylus-v1/tree/master/src/sc/stylus) repository. |
| **Firebase**              | Stores user profiles, quiz questions, answers, and other game data; also provides real-time updates for the Host and participants during gameplay.                      |




<h3>How to use <a href="https://trivia-stylus.vercel.app/">TriviaBase</a> as host:</h3>

<i>Claim <a href="https://trib-faucet.vercel.app/">$trib</a> token to interact with the platform</i>

Steps:
    TLDR; (view the video setup below).
1. Connect your wallet to sign in

2. Select host a game

3. Pick a mode either Fun or Reward mode. <br/>
    i. Fun mode: rewards are either souvenirs or anything the host wants to give out.
   <br/>
    ii. Reward mode: rewards are the $TRIB tokens.
<br/>
5. Set the question and answer or Autogenerate question with our AI by just inputting the topic of choice.

6. If reward mode, you set the reward pool amount, i.e. the amount of $TRIB tokens you want to give out.<br/>
    i. send the $TRIB tokens to the contract.<br/>
    ii. wait for the wallet pop up to sign the transaction<br/>

7. If transaction successful, a random unique code is generated as `TBPABC12`<br/>

8. Share the code with your audience to participate.

9. The audience can now participate in the game by entering the code.<br/>
10. After the game is over, the $TRIB tokens are distributed to the winners automatically.<br/>
    - how rewards are distributed to winners:<br/>
    Assume the host set the reward pool to 100 $TRIB tokens.<br/>
    i. the first place gets 50% of the reward pool. (50 $TRIB tokens)<br/>
    ii. the second place gets 30% of the reward pool. (30 $TRIB tokens)<br/>
    iii. the third place gets 20% of the reward pool. (20 $TRIB tokens)<br/>


<h3>How to use <a href="https://trivia-stylus.vercel.app/">TriviaBase</a> as a player:</h3>

Steps:

1. Connect your wallet to sign in.
2. Select join a game.
3. Enter the code shared by the host to join the game.
4. Answer the questions and submit.
5. If you are part of the top 3 winners, you will receive the rewards automatically to your wallet.

Video setup:


[![TriviaBase Tutorial](https://img.youtube.com/vi/PXM8lCyiVJY/0.jpg)](https://www.youtube.com/watch?v=PXM8lCyiVJY)
