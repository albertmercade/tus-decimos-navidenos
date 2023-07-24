import { useState } from "react";
import { useMediaQuery } from "react-responsive";

// Third-party components
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

// Local Components
import Loading from "../loading/loading";
import Ticket from "../ticket/ticket";

import "./ownedTickets.scss";

const AddTicketModal = (props) => {
  const { handleClose, submitForm, showModal, clicked, errors } = props;

  return (
    <Modal show={showModal} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Añadir décimo</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitForm}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="ticketNumber">
            <Form.Label>Número del décimo</Form.Label>
            <Form.Control
              type="text"
              name="number"
              placeholder="01234"
              maxLength={5}
              isInvalid={clicked && errors.number}
            />
            <Form.Control.Feedback type="invalid">
              {errors.number}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="ticketMoneyPlayed">
            <Form.Label>Dinero jugado</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="moneyPlayed"
                placeholder="20"
                isInvalid={clicked && errors.moneyPlayed}
              />
              <InputGroup.Text>€</InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {errors.moneyPlayed}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="submit">
            Añadir
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const OwnedTickets = (props) => {
  const {
    loading,
    lotteryStarted,
    lotteryFinished,
    aggregateData,
    tickets,
    addTicket,
    removeTicket,
  } = props;

  const [showAddTicket, setShowAddTicket] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [errors, setErrors] = useState({});

  const isMobile = useMediaQuery({ query: "(max-width: 650px)" });

  const submitTicketForm = (event) => {
    event.preventDefault();
    const number = parseInt(event.target.number.value);
    const moneyPlayed = parseInt(event.target.moneyPlayed.value);

    setClicked(true);

    let err = {};
    if (!number) {
      err["number"] = "Debes proporcionar un número de décimo.";
    }
    if (number < 0 || number >= 100000) {
      err["number"] = "El número del décimo debe estar entre 00000 y 99999.";
    }
    if (!moneyPlayed) {
      err["moneyPlayed"] = "Debes introducir el dinero jugado.";
    }
    if (moneyPlayed <= 0) {
      err["moneyPlayed"] = "El dinero jugado debe ser mayor a 0.";
    }

    if (Object.keys(err).length === 0) {
      setClicked(false);
      setShowAddTicket(false);
      addTicket(number, moneyPlayed);
    } else {
      setErrors(err);
    }
  };

  return (
    <>
      <div id="tickets">
        <div id="tickets-header">
          <h2>Tus décimos</h2>
          {!isMobile && tickets.length === 0 && (
            <button
              id="add-ticket-header"
              disabled={loading}
              onClick={() => setShowAddTicket(true)}
            >
              <span>＋</span>Añadir décimo
            </button>
          )}
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            {tickets.length > 0 && (
              <div id="aggregate-data">
                <div className="aggregate-item">
                  <h4>Ganacias totales</h4>
                  <p>{aggregateData.totalEarnings}€</p>
                </div>
                <div className="aggregate-item">
                  <h4>Dinero jugado</h4>
                  <p>{aggregateData.totalMoneyPlayed}€</p>
                </div>
              </div>
            )}
            <div id="tickets-grid">
              {isMobile && (
                <button
                  id="add-ticket-mobile"
                  disabled={loading}
                  onClick={() => setShowAddTicket(true)}
                >
                  <span>＋</span> Añadir décimo
                </button>
              )}
              {tickets.map((ticket, idx) => (
                <Ticket
                  imgData={ticket.imgData}
                  prize={ticket.prize}
                  earnings={ticket.earnings}
                  lotteryStarted={lotteryStarted}
                  lotteryFinished={lotteryFinished}
                  removeTicket={() => removeTicket(idx)}
                  key={`ticket-${idx}`}
                />
              ))}
              {!isMobile && tickets.length > 0 && (
                <button
                  id="add-ticket"
                  disabled={loading}
                  onClick={() => setShowAddTicket(true)}
                >
                  <p>
                    <span>＋</span>Añadir décimo
                  </p>
                </button>
              )}
            </div>
            {tickets.length === 0 && (
              <div id="no-tickets">
                No tienes ningún décimo añadido todavía.
              </div>
            )}
          </>
        )}
      </div>
      <AddTicketModal
        handleClose={() => {
          setShowAddTicket(false);
          setClicked(false);
        }}
        submitForm={submitTicketForm}
        showModal={showAddTicket}
        clicked={clicked}
        errors={errors}
      />
    </>
  );
};

export default OwnedTickets;
