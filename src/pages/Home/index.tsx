import Game from "components/Game";
import Header from "components/Header";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  claim,
  getGameBalance,
  getOwnerBalance,
  getPlayerBalance,
  init,
  mint,
  startGame,
  withdraw,
} from "services/Web3Client";

declare let window: any;

const Home = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [ownerBalance, setOwnerBalance] = useState("0");
  const [balancePlayer, setBalancePlayer] = useState("0");
  const [balanceGame, setBalanceGame] = useState("0");
  const [startedGame, setStartedGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    init();
    getSelectedAccount();
    getBalanceGame();
    getBalanceOwner();
    getBalancePlayer();
  }, []);

  const getSelectedAccount = async () => {
    const provider = window.ethereum;

    if (provider) {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      setSelectedAccount(accounts[0]);
    }
  };

  const getBalanceOwner = () => {
    getOwnerBalance().then((response) => {
      setOwnerBalance((response / 10 ** 18).toString());
      console.log("Owner balance: ", Number(ownerBalance));
    });
  };

  const getBalancePlayer = () => {
    getPlayerBalance().then((response) => {
      setBalancePlayer((response / 10 ** 18).toString());
      console.log("Balance Player: ", balancePlayer);
    });
  };

  const getBalanceGame = () => {
    getGameBalance().then((response) => {
      setBalanceGame((response / 10 ** 18).toString());
      console.log("Balance Game: ", balanceGame);
    });
  };

  const handleFreeCoins = () => {
    mint()
      .then(() => {
        toast.success(`Congratulations, you got 10 LBC (Luby Coins)`);
        getBalancePlayer();
      })
      .catch((err) => {
        console.log("wi", err);
        toast.error("Error getting free Luby Coins");
      });
  };

  const handleClaim = () => {
    claim()
      .then(() => {
        getBalanceGame();
        getBalancePlayer();
        toast.success(
          `Congratulations, you claimed ${balanceGame} LBC (Luby Coins)`
        );
      })
      .catch((err) => {
        toast.error(`Error claiming Luby Coins`);
        console.log(err);
      });
  };

  const handleWithdraw = () => {
    withdraw()
      .then(() => {
        getBalanceOwner();
        getBalancePlayer();
        toast.success(`Congratulations, you withdrew ${ownerBalance} LBC`);
      })
      .catch((err) => {
        console.log("withdraw: ", err);
        toast.error(`Error withdrawing Luby Coins`);
        toast.error(err.message);
      });
  };

  const handleStartGame = () => {
    startGame()
      .then((tx) => {
        setStartedGame(true);
        getBalanceGame();
        getBalancePlayer();
        getBalanceOwner();
      })
      .catch((err) => {
        console.log("start", err);
        toast.error("Error starting the game");
      });
  };

  const handleEndGame = (score: number, totalQuestions: number) => {
    setStartedGame(false);
    setGameOver(true);
    setScore(score);
    setTotalQuestions(totalQuestions);
    getBalanceGame();
    getBalancePlayer();
  };

  return (
    <div className="container mx-auto pt-2">
      <Header
        onClickFreeCoins={handleFreeCoins}
        onClickClaim={handleClaim}
        onClickWithdraw={handleWithdraw}
        balancePlayer={Number(balancePlayer)}
        balanceGame={Number(balanceGame)}
        ownerBalance={Number(ownerBalance)}
        selectedAccount={selectedAccount}
      />
      <div className="container flex justify-center mx-auto mt-36">
        <div className="card w-3/4 bg-slate-800 text-neutral-content drop-shadow-lg border-2 border-slate-500">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl">Let's Play!</h2>
            <p className="text-center mt-5 text-lg">
              You need at least 10 LBCs to start the game. <br />
              <br /> Incorrect answers = -2 LBCs and correct answers = +2 LBCs
            </p>
            {!startedGame && !gameOver ? (
              <div className="card-actions justify-center mt-12">
                <button
                  className="btn btn-info w-96 hover:bg-sky-600"
                  onClick={handleStartGame}
                  disabled={Number(balancePlayer) < 10}
                >
                  Play now!
                </button>
              </div>
            ) : !startedGame && gameOver ? (
              <div className="text-center">
                <div className="divider"></div>
                <h2 className="text-2xl text-red-500">Game Over!</h2>
                <p className="text-2xl">
                  Your score was {score} of {totalQuestions} <br />
                  <br />
                  {score === totalQuestions ? (
                    <span className="text-green-500">
                      Congratulations, you won {totalQuestions * 2} LBCs!
                    </span>
                  ) : score === 0 ? (
                    <span className="text-red-500">
                      You lost {totalQuestions * 2} LBCs!
                    </span>
                  ) : score < totalQuestions / 2 ? (
                    <span className="text-red-500">
                      You lost {(totalQuestions - score) * 2 - score * 2} LBCs!
                    </span>
                  ) : (
                    score > totalQuestions / 2 && (
                      <span className="text-green-500">
                        Congratulations, you won{" "}
                        {score * 2 - (totalQuestions - score) * 2} LBCs!
                      </span>
                    )
                  )}
                </p>
                <div className="card-actions justify-center mt-12">
                  <button
                    className="btn btn-info w-96 hover:bg-sky-600"
                    onClick={handleStartGame}
                    disabled={Number(balancePlayer) < 10}
                  >
                    Play again!
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="divider"></div>
                <Game
                  onEndGame={handleEndGame}
                  updateGameBalance={getBalanceGame}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
