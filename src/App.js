import { useState, useEffect } from "react";
import superagent from "superagent";

// Local components
import Header from "./components/header/header";
import StatusInfo from "./components/statusInfo/statusinfo";
import OwnedTickets from "./components/ownedTickets/ownedTickets";
import Footer from "./components/footer/footer";

// Utils
import { numToArray, generateLotteryTicket } from "./utils/GenerateTicketUtil";

// Styling
import "./App.scss";

const NEXT_DRAW_DATE = "2022-12-22T09:00:00";

const App = () => {
  const [ticketInfoList, setTicketInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aggregate, setAggregate] = useState({});
  const [lotteryStatus, setLotteryStatus] = useState(-1);
  const [lotteryStarted, setLotteryStarted] = useState(false);
  const [lotteryFinished, setLotteryFinished] = useState(false);

  const getTicketsData = async (ticketList) => {
    const results = await Promise.all(
      ticketList.map(async (ticket) => {
        const resp = await superagent.get(
          `https://y2i7gbq153.execute-api.eu-west-3.amazonaws.com/dev?n=${ticket.number}`
        );

        const numberArray = numToArray(ticket.number);
        const imgData = await generateLotteryTicket(
          numberArray,
          ticket.moneyPlayed
        );

        return {
          ...ticket,
          numberArray,
          prize: resp.body.premio,
          earnings: (resp.body.premio / 20) * ticket.moneyPlayed,
          imgData,
        };
      })
    );

    return results;
  };

  const addTicket = async (number, moneyPlayed) => {
    setLoading(true);

    // Get ticket object
    const ticket = { number, moneyPlayed };

    // Update localStorage
    let ticketList = JSON.parse(localStorage.getItem("ticket_list")) || [];
    ticketList.unshift(ticket);
    localStorage.setItem("ticket_list", JSON.stringify(ticketList));

    // Update ticketInfoList
    const [ticketInfo, ..._] = await getTicketsData([ticket]);
    setTicketInfoList([ticketInfo, ...ticketInfoList]);

    // Update aggregates
    setAggregate({
      totalEarnings: aggregate.totalEarnings + ticketInfo.earnings,
      totalMoneyPlayed: aggregate.totalMoneyPlayed + ticketInfo.moneyPlayed,
    });

    setLoading(false);
  };

  const removeTicket = async (idx) => {
    // Update localStorage
    const ticketList = JSON.parse(localStorage.getItem("ticket_list")) || [];
    ticketList.splice(idx, 1);
    localStorage.setItem("ticket_list", JSON.stringify(ticketList));

    // Update ticket info list
    const [ticketInfo] = ticketInfoList.splice(idx, 1);
    setTicketInfoList(ticketInfoList);

    // Update aggregates
    setAggregate({
      totalEarnings: aggregate.totalEarnings - ticketInfo.earnings,
      totalMoneyPlayed: aggregate.totalMoneyPlayed - ticketInfo.moneyPlayed,
    });
  };

  useEffect(() => {
    setLoading(true);

    // Get saved tickets in local storage, otherwise empty Array
    const ticketList = JSON.parse(localStorage.getItem("ticket_list")) || [];

    // Get ticket prizes from El Pais Christmas Lottery API
    const loadTicketPrizesAndImgs = async (ticketList) => {
      const ticketPrizes = await getTicketsData(ticketList);
      setTicketInfoList(ticketPrizes);

      setAggregate({
        totalEarnings: ticketPrizes.reduce(
          (sum, ticket) => sum + ticket.earnings,
          0
        ),
        totalMoneyPlayed: ticketPrizes.reduce(
          (sum, ticket) => sum + ticket.moneyPlayed,
          0
        ),
      });

      const respStatus = await superagent.get(
        "https://y2i7gbq153.execute-api.eu-west-3.amazonaws.com/dev?s=1"
      );
      setLotteryStatus(respStatus.body.status);
      setLotteryStarted(respStatus.body.status > 0);
      setLotteryFinished(respStatus.body.status > 1);
    };
    loadTicketPrizesAndImgs(ticketList);

    // Set loading to false
    setLoading(false);
  }, []);

  return (
    <div className="App">
      <div id="content-wrapper">
        <Header />
        <StatusInfo
          lotteryStatus={lotteryStatus}
          nextDrawDate={NEXT_DRAW_DATE}
        />
        <OwnedTickets
          loading={loading}
          lotteryStarted={lotteryStarted}
          lotteryFinished={lotteryFinished}
          aggregateData={aggregate}
          tickets={ticketInfoList}
          addTicket={addTicket}
          removeTicket={removeTicket}
        />
      </div>
      <Footer />
    </div>
  );
};

export default App;
