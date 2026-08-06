import { Button, Card, Col, Row } from "react-bootstrap";
import type { ActiveShoppingList } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router";

interface ListSectionProps {
  activeShoppingList: ActiveShoppingList | null;
}

function ListSection({ activeShoppingList }: ListSectionProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="border-0 rounded-4 overflow-hidden shadow-lg position-relative my-4 mx-lg-4"
      style={{ minWidth: "195px" }}
    >
      <div
        style={{
          backgroundImage: `url("https://jooinn.com/images/blank-paper-2.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
          transform: "scale(1.05)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      <Card.Body
        className="position-relative p-4 text-light"
        style={{ zIndex: 2 }}
      >
        <div className="d-flex justify-content-between align-items-start mb-4">
          <h2 className="fw-bold m-0 fst-italic text-dark">Shopping List</h2>
        </div>

        <Row className="g-3">
          {activeShoppingList?.items?.map((item) => (
            <Col key={item.shoppingListItemId} xs={12} sm={6} md={4}>
              <Card className="bg-dark bg-opacity-100 text-light border-0 rounded-3 shadow-sm h-100 p-2">
                <Card.Body className="d-flex flex-column justify-content-between p-2">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={
                        item.ingredientDefinition.imageUrl ||
                        "https://via.placeholder.com/50?text=Food"
                      }
                      alt={item.ingredientDefinition.name}
                      className="rounded-3 object-fit-cover flex-shrink-0"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div className="overflow-hidden">
                      <span className="text-muted small text-uppercase fw-bold d-block text-truncate">
                        {item.ingredientDefinition.category}
                      </span>
                      <h6 className="fw-semibold m-0 text-truncate">
                        {item.ingredientDefinition.name}
                      </h6>
                      <p className="mt-2 mb-0 small text-light text-opacity-75">
                        Buy: {item.suggestedQuantity}{" "}
                        {item.suggestedUnit === "MILLILITERS"
                          ? "ml"
                          : item.suggestedUnit === "GRAMS"
                            ? "g"
                            : "pcs"}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {activeShoppingList && (
          <div className="mt-4 text-center">
            <Button
              variant="secondary"
              className="w-100 py-2 text-dark fw-bold border-1 border-dark shadow-sm rounded-3"
              style={{ maxWidth: "280px" }} // <--- Limita la larghezza massima
              onClick={() => navigate("/my-list")}
            >
              See all
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ListSection;
