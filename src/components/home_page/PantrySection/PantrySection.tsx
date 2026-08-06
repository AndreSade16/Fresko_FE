import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import type { PantryItem } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router";
import { SyncLoader } from "react-spinners";

interface PantrySectionProps {
  expiringItems: PantryItem[] | null;
  isLoading: boolean;
}

function PantrySection({ expiringItems, isLoading }: PantrySectionProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="border-0 rounded-4 overflow-hidden shadow-lg position-relative my-5 bg-primary mx-lg-4"
      style={{ minWidth: "195px" }}
    >
      <Card.Body
        className={
          isLoading
            ? "position-relative p-3 p-md-4 text-light d-flex flex-column align-items-center"
            : "position-relative p-3 p-md-4 text-light"
        }
        style={{ zIndex: 2 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0 fst-italic">Fridge & Pantry</h2>
        </div>
        {isLoading ? (
          <SyncLoader color="white" className="my-4" />
        ) : (
          <Row className="g-3">
            {expiringItems?.map((item) => (
              <Col key={item.pantryItemId} xs={12} sm={6} md={4}>
                <Card className="bg-dark bg-opacity-100 border-0 rounded-3 shadow-sm h-100 p-2">
                  <Card.Body className="d-flex flex-column justify-content-between p-2">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={
                          item.imageUrl ||
                          "https://via.placeholder.com/50?text=Food"
                        }
                        alt={item.ingredientName}
                        className="rounded-3 object-fit-cover flex-shrink-0"
                        style={{ width: "48px", height: "48px" }}
                      />
                      <div className="overflow-hidden">
                        <span className="text-muted small text-uppercase fw-bold d-block text-truncate">
                          {item.category}
                        </span>
                        <h6 className="fw-semibold m-0 text-truncate">
                          {item.ingredientName}
                        </h6>
                        <p className="mt-2 mb-0">
                          {item.quantity} {item.unit.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25">
                      <span className="small text-muted">Expires in:</span>
                      <Badge
                        bg={
                          item.daysUntilExpiration <= 1 ? "danger" : "warning"
                        }
                        className={
                          item.daysUntilExpiration <= 1
                            ? "px-2 py-1"
                            : "px-2 py-1 text-dark"
                        }
                      >
                        {item.daysUntilExpiration}{" "}
                        {item.daysUntilExpiration === 1 ? "day" : "days"}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div className="mt-4 text-center">
          <Button
            variant="secondary"
            className="w-100 py-2 text-dark fw-bold border-1 border-dark shadow-sm rounded-3"
            style={{ maxWidth: "280px" }}
            onClick={() => navigate("/pantry")}
          >
            Open Pantry
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PantrySection;
