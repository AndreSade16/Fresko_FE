import { Alert, Badge, Button, Card, Col, Row } from "react-bootstrap";
import type {
  IngredientDefinitionPage,
  IngredientDefinitionPageContent,
  StandardError,
} from "../../../interfaces/interfaces";
import { PulseLoader } from "react-spinners";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface IngredientsListProps {
  data: IngredientDefinitionPage | null;
  isLoading: boolean;
  error: StandardError | string | null;
  onLoadMore: (nextPage: number) => void;
  onDeleteItem?: (item: IngredientDefinitionPageContent) => void;
  onAddItem?: (item: IngredientDefinitionPageContent) => void;
  userRole: string | null;
  isAdding: boolean;
  setIsAdding: Dispatch<SetStateAction<boolean>>;
}

function IngredientsList({
  data,
  isLoading,
  error,
  onLoadMore,
  onDeleteItem,
  onAddItem,
  userRole,
  isAdding,
  setIsAdding,
}: IngredientsListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const items = data?.content || [];
  const isLastPage = data?.last ?? true;
  const currentPage = data?.number ?? 0;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(typeof error === "string" ? error : error.message);
    setIsAdding(false);
  }

  if (!isLoading && data !== null && items.length === 0) {
    return (
      <Alert variant="secondary" className="my-3 text-center">
        No ingredient found.
      </Alert>
    );
  }

  return (
    <div className="ingredient-list-container mt-3">
      {errorMessage && (
        <Alert
          variant="danger"
          className="my-3"
          dismissible
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {items.map((item) => {
          const {
            name,
            description,
            imageUrl,
            category,
            defaultStorageLocation,
            shelfLifeDays,
            ingredientDefinitionId,
          } = item;

          return (
            <Col key={ingredientDefinitionId}>
              <Card className="h-100 shadow-sm hover-card bg-primary">
                {imageUrl && (
                  <Card.Img
                    variant="top"
                    src={imageUrl}
                    alt={name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 fs-6 fw-bold">
                      {name}
                    </Card.Title>
                    <Badge bg="secondary" className="ms-1 text-dark">
                      {category}
                    </Badge>
                  </div>

                  <Card.Text className="text-muted small flex-grow-1">
                    {description}
                  </Card.Text>

                  <div className="mt-auto border-top pt-2 small">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-semibold">Shelf life days:</span>
                      <span>{shelfLifeDays}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-semibold">Suggested storaging:</span>
                      <Badge
                        bg="secondary"
                        text="dark"
                        className="d-flex align-items-center"
                        style={{ maxHeight: "24px" }}
                      >
                        {defaultStorageLocation === "REFRIGERATOR"
                          ? "FRIDGE"
                          : defaultStorageLocation}
                      </Badge>
                    </div>

                    <div className="d-flex gap-2 justify-content-center">
                      {isAdding ? (
                        <PulseLoader />
                      ) : (
                        <Button
                          variant="outline-light"
                          size="sm"
                          className="w-50 fw-semibold"
                          onClick={() => onAddItem?.(item)}
                          disabled={isAdding}
                        >
                          {isAdding ? <PulseLoader /> : "Add to List"}
                        </Button>
                      )}
                      {userRole === "ADMIN" && (
                        <Button
                          variant="warning"
                          size="sm"
                          className="w-50 fw-semibold"
                          onClick={() => onDeleteItem?.(item)}
                          disabled={isAdding}
                        >
                          {isAdding ? <PulseLoader /> : "Edit"}
                        </Button>
                      )}
                      {userRole === "ADMIN" && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="w-50 fw-semibold"
                          onClick={() => onDeleteItem?.(item)}
                          disabled={isAdding}
                        >
                          {isAdding ? <PulseLoader /> : "Delete"}
                        </Button>
                      )}
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

export default IngredientsList;
