import { useEffect, useRef } from "react";
import { Row, Col, Card, Badge, Alert, Button } from "react-bootstrap";
import type {
  PantryPage,
  PantryPageContent,
  StandardError,
} from "../../../interfaces/interfaces";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

interface PantryListProps {
  data: PantryPage | null;
  isLoading: boolean;
  error: StandardError | string | null;
  onLoadMore: (nextPage: number) => void;
  onDeleteItem?: (item: PantryPageContent) => void;
  onEditItem?: (item: PantryPageContent) => void;
}

function PantryList({
  data,
  isLoading,
  error,
  onLoadMore,
  onDeleteItem,
  onEditItem,
}: PantryListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const items = data?.content || [];
  const isLastPage = data?.last ?? true;
  const currentPage = data?.number ?? 0;

  useEffect(() => {
    if (isLoading || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore(currentPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, isLastPage, currentPage, onLoadMore]);

  if (error) {
    const errorMessage = typeof error === "string" ? error : error.message;
    toast.error(errorMessage);
  }

  if (!isLoading && data !== null && items.length === 0) {
    return (
      <Alert variant="info" className="my-3 text-center">
        No item found in the pantry.
      </Alert>
    );
  }

  return (
    <div className="pantry-list-container w-100">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4 w-100">
        {items.map((item) => {
          const {
            ingredientDefinition,
            quantity,
            expirationDate,
            storageLocation,
            pantryItemId,
            purchaseDate,
          } = item;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const expDateObj = new Date(expirationDate);
          expDateObj.setHours(0, 0, 0, 0);

          const isExpired = expDateObj < today;
          const formattedExpDate = new Date(
            expirationDate,
          ).toLocaleDateString();
          const formattedPurDate = new Date(purchaseDate).toLocaleDateString();
          const diffInTime = expDateObj.getTime() - today.getTime();
          const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

          return (
            <Col key={pantryItemId}>
              <Card className="h-100 shadow-sm hover-card bg-primary">
                {ingredientDefinition.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={ingredientDefinition.imageUrl}
                    alt={ingredientDefinition.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 fs-6 fw-bold">
                      {ingredientDefinition.name}
                    </Card.Title>
                    <Badge bg="secondary" className="ms-1 text-dark">
                      {ingredientDefinition.category}
                    </Badge>
                  </div>

                  <Card.Text className="text-muted small flex-grow-1">
                    {ingredientDefinition.description}
                  </Card.Text>

                  <div className="mt-auto border-top pt-2 small">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-semibold">Quantity:</span>
                      <span>
                        {quantity} {ingredientDefinition.unit}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-semibold">Location:</span>
                      <Badge bg="secondary" text="dark">
                        {storageLocation === "REFRIGERATOR"
                          ? "FRIDGE"
                          : storageLocation}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-semibold">Purchased:</span>
                      <span className="text-secondary fw-semibold">
                        {formattedPurDate}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-semibold">Expires:</span>
                      {isExpired ? (
                        <Badge
                          bg="danger"
                          className="text-white fw-bold px-2 py-1"
                        >
                          Expired {formattedExpDate}
                        </Badge>
                      ) : (
                        <span className="text-warning fw-semibold">
                          {diffInDays <= 3 ? "⚠️" : ""} {formattedExpDate}
                        </span>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="w-50 fw-semibold"
                        onClick={() => onEditItem?.(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="w-50 fw-semibold"
                        onClick={() => onDeleteItem?.(item)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div ref={sentinelRef} style={{ height: "20px", margin: "10px 0" }} />

      {isLoading && (
        <div className="text-center my-4">
          <PulseLoader color="white" />
        </div>
      )}
    </div>
  );
}

export default PantryList;
