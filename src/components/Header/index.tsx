import { FaCoins } from "react-icons/fa";

type HeaderProps = {
  onClickFreeCoins: () => void;
  onClickClaim: () => void;
  balancePlayer: number;
  balanceGame: number;
};

const Header = ({
  onClickFreeCoins,
  balancePlayer,
  onClickClaim,
  balanceGame,
}: HeaderProps) => {
  return (
    <div className="navbar bg-neutral text-neutral-content rounded-xl">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button className="btn">Free 10 LubyCoins</button>
            </li>
            <li>
              <button className="btn">Claim LBC</button>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl text-gray-200">
          Luby Games
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <button className="btn text-base" onClick={onClickFreeCoins}>
              Free 10 LubyCoins
            </button>
          </li>
          <li>
            <button
              className="btn text-base"
              onClick={onClickClaim}
              disabled={balanceGame <= 0}
            >
              {balanceGame > 0 ? `Claim ${balanceGame} LBCs` : "Claim LBC"}
            </button>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-value text-2xl">{balancePlayer} LBC</div>
            <div className="stat-figure">
              <FaCoins size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
