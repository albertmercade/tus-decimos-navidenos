import { createCanvas, loadImage } from "canvas";
import tickettemplate from "../assets/images/ticket-template-full.jpeg";

const NUMSDICT = {
  0: "CERO",
  1: "UNO",
  2: "DOS",
  3: "TRES",
  4: "CUATRO",
  5: "CINCO",
  6: "SEIS",
  7: "SIETE",
  8: "OCHO",
  9: "NUEVE",
};

const numToArray = (number) => {
  const numArray = number.toString().split("");
  return Array(5 - numArray.length)
    .fill("0")
    .concat(numArray);
};

const generateLotteryTicket = async (
  ticketNumber = Array(5).fill("0"),
  money = 20
) => {
  const WIDTH = 1000;
  const HEIGHT = 590;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const context = canvas.getContext("2d");

  const ticketTemplateImage = await loadImage(tickettemplate);
  context.drawImage(ticketTemplateImage, 0, 0, WIDTH, HEIGHT);

  context.font = "bold 50pt Arial";
  context.textAlign = "center";
  context.fillStyle = "#000";
  context.fillText(money, 892.5, 422.5);

  for (const [idx, num] of ticketNumber.entries()) {
    // Big number
    context.font = "800 73pt Inter, Arial";
    context.textAlign = "center";
    context.fillStyle = "#000";
    context.fillText(num, 385 + 90 * idx, 147);

    // Small number text
    context.font = "bold 11pt Inter, Arial";
    context.textAlign = "center";
    context.fillStyle = "#000";
    context.fillText(NUMSDICT[num], 385 + 90 * idx, 167);
  }

  return canvas.toDataURL("image/png");
};

export { numToArray, generateLotteryTicket };
