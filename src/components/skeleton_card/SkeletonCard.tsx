import { Card, Col } from "react-bootstrap";

function SkeletonCard() {
  return (
    <Col>
      <Card className="h-100 shadow-sm bg-primary text-white pt-3 px-3">
        <div
          className="placeholder-glow rounded-3 overflow-hidden"
          style={{ height: "200px" }}
        >
          <div className="placeholder w-100 h-100" />
        </div>

        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between mb-2">
            <span className="placeholder-glow w-50">
              <span className="placeholder col-8" />
            </span>

            <span className="placeholder-glow">
              <span
                className="placeholder"
                style={{ width: "70px", height: "24px" }}
              />
            </span>
          </div>

          <div className="flex-grow-1 placeholder-glow">
            <span className="placeholder col-12 mb-2" />
            <span className="placeholder col-9 mb-2" />
          </div>

          <div className="mt-auto border-top pt-2">
            <div className="d-flex justify-content-between mb-2 placeholder-glow">
              <span className="placeholder col-6" />
              <span className="placeholder col-2" />
            </div>

            <div className="d-flex justify-content-between mb-3 placeholder-glow">
              <span className="placeholder col-6" />
              <span className="placeholder col-3" />
            </div>

            <div className="placeholder-glow">
              <span className="placeholder col-12" />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default SkeletonCard;
