import { useEffect, useState } from "react";

import Loading from "../loading/loading";

import logoTVE from "../../resources/images/logo-tve.png";
import logoRNE from "../../resources/images/logo-rne.png";
import logoEP from "../../resources/images/logo-elpais.png";

import "./statusinfo.scss";

const timeToLottery = (nextDrawDate) => {
  const drawDate = new Date(nextDrawDate);
  const timeDiff = drawDate - Date.now();

  const totalSecs = Math.floor(timeDiff / 1000);
  return {
    days: Math.floor(totalSecs / (60 * 60 * 24)),
    hours: Math.floor((totalSecs / (60 * 60)) % 24),
    mins: Math.floor((totalSecs / 60) % 60),
    secs: totalSecs % 60,
  };
};

const decreaseTimeLeft = (timeLeft) => {
  let { days, hours, mins, secs } = timeLeft;

  secs -= 1;
  if (secs < 0) {
    secs = 59;
    mins -= 1;
  }

  if (mins < 0) {
    mins = 59;
    hours -= 1;
  }

  if (hours < 0) {
    hours = 23;
    days -= 1;
  }

  return { days, hours, mins, secs };
};

const countdown = (timeLeft) => {
  const { days, hours, mins, secs } = timeLeft;
  return (
    <div id="countdown-timer-wrapper">
      {timeLeft.days < 21 ? (
        <h3>El sorteo empezará en</h3>
      ) : (
        <>
          <h2>¡Hasta el próximo sorteo!</h2>
          <h4>Quedan..</h4>
        </>
      )}
      <div id="countdown-timer">
        <div className="countdown-item">
          <h1>{days < 10 ? `0${days}` : days}</h1>
          <p>Días</p>
        </div>
        <div className="countdown-item">
          <h1>{hours < 10 ? `0${hours}` : hours}</h1>
          <p>Horas</p>
        </div>
        <div className="countdown-item">
          <h1>{mins < 10 ? `0${mins}` : mins}</h1>
          <p>Minutos</p>
        </div>
        <div className="countdown-item">
          <h1>{secs < 10 ? `0${secs}` : secs}</h1>
          <p>Segundos</p>
        </div>
      </div>
    </div>
  );
};

const liveLottery = () => {
  return (
    <div id="live-lottery-wrapper">
      <h1>¡El sorteo ha empezado!</h1>
      <h4>Síguelo en directo con...</h4>
      <div>
        <a
          id="link-tve"
          href="https://www.rtve.es/play/videos/directo/canales-lineales/la-1/"
        >
          <img src={logoTVE} alt="Logo TVE" />
          <p>Televisión Española</p>
        </a>
        <a id="link-rne" href="https://www.rtve.es/play/radio/">
          <img src={logoRNE} alt="Logo RNE" />
          <p>Radio Nacional de España</p>
        </a>
        <a id="link-elpais" href="https://elpais.com/noticias/loteria-navidad/">
          <img src={logoEP} alt="Logo El País" />
          <p>El País</p>
        </a>
      </div>
    </div>
  );
};

const provisionalResults = () => {
  return (
    <div id="finished-lottery-wrapper">
      <h1>¡El sorteo ha finalizado!</h1>
      <h4>Los resultados son provisionales, aunque deberían ser correctos.</h4>
    </div>
  );
};

const definitiveResults = () => {
  return (
    <div id="finished-lottery-wrapper">
      <h1>¡El sorteo ha finalizado!</h1>
      <h4>Los resultados son oficiales.</h4>
    </div>
  );
};

const statusContent = (status, timeLeft, timeFinished) => {
  switch (status) {
    case 0:
      return timeFinished ? liveLottery() : countdown(timeLeft);
    case 1:
      return liveLottery();
    case 2:
    case 3:
      return provisionalResults();
    case 4:
      return timeLeft.days > 360 ? definitiveResults() : countdown(timeLeft);
    default:
      return <Loading />;
  }
};

const StatusInfo = (props) => {
  const { lotteryStatus, nextDrawDate } = props;

  const [timeFinished, setTimeFinished] = useState(
    new Date(nextDrawDate) - Date.now() < 0
  );
  const [timeLeft, setTimeLeft] = useState(timeToLottery(nextDrawDate));

  useEffect(() => {
    if (!timeFinished) {
      var interval =
        (lotteryStatus === 0 || lotteryStatus >= 4) &&
        setInterval(() => {
          setTimeLeft((timeLeft) => decreaseTimeLeft(timeLeft));
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [lotteryStatus]);

  return (
    <div id="statusinfo-wrapper">
      {statusContent(lotteryStatus, timeLeft, timeFinished)}
    </div>
  );
};

export default StatusInfo;
