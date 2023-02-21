import Spinner from "react-bootstrap/Spinner";

import "./loading.scss";

const Loading = () => {
  return (
    <div id="loading-wrapper">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
