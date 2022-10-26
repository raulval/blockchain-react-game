import Header from "components/Header";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBalanceOf, getOwnerBalance, init, mint } from "services/Web3Client";

const Home = () => {
  const [ownerBalance, setOwnerBalance] = useState("0");
  const [balancePlayer, setBalancePlayer] = useState("0");

  useEffect(() => {
    init();
    getBalance();
    getBalanceOwner();
  }, []);

  const getBalanceOwner = () => {
    getOwnerBalance()
      .then((response) => {
        console.log("Owner balance: ", ownerBalance);
        setOwnerBalance(response);
      })
      .catch((err) => {
        console.log(err);
        console.log("Not admin!");
      });
  };

  const getBalance = async () => {
    const balance = await getBalanceOf();
    setBalancePlayer(balance);
  };

  const handleFreeCoins = () => {
    mint()
      .then(() => {
        toast.success(`Congratulations, you got 10 LBC (Luby Coins)`);
        getBalance();
      })
      .catch((err) => {
        console.log("wi", err);
      });

    console.log("balancePlayer", balancePlayer);
  };

  return (
    <div className="container mx-auto pt-2">
      <Header
        onClickFreeCoins={handleFreeCoins}
        balancePlayer={Number(balancePlayer) / 10 ** 18}
      />
      <div className="container flex justify-center mx-auto mt-36">
        <div className="card w-3/4 bg-slate-800 text-neutral-content drop-shadow-lg border-2 border-slate-500">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl">Let's Play!</h2>
            <p className="text-center mt-5 text-lg">
              You need at least 10 LBCs to start the game. <br />
              <br /> Incorrect answers = -2 LBCs and correct answers = +2 LBCs
            </p>
            <div className="card-actions justify-center mt-12">
              <button
                className="btn btn-info w-96 hover:bg-sky-600"
                disabled={Number(balancePlayer) / 10 ** 18 < 10}
              >
                Play now!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
