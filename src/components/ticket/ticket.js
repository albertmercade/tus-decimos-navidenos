import { IoMdCloseCircle } from "react-icons/io";

import "./ticket.scss";

const Ticket = (props) => {
  const {
    lotteryStarted,
    lotteryFinished,
    imgData,
    prize,
    earnings,
    removeTicket,
  } = props;

  return (
    <div className="ticket-wrapper">
      <img src={imgData} alt={`Billete de lotería con el `} />
      {lotteryStarted && (
        <div className="prize-info-wrapper">
          {prize > 0 ? (
            <>
              <p>Tus ganancias:</p>
              <p>
                <span>{earnings}€</span>
              </p>
            </>
          ) : lotteryFinished ? (
            <p>No ha salido premiado.</p>
          ) : (
            <p>No ha salido premiado todavía.</p>
          )}
        </div>
      )}
      <button className="delete-ticket" onClick={removeTicket}>
        <IoMdCloseCircle size="2rem" color="#ad1313" className="delete-icon" />
      </button>
    </div>
  );
};

export default Ticket;
