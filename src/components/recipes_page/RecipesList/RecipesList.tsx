import {
  useRef,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { Alert, Badge, Button, Card, Col, Row } from "react-bootstrap";
import { PulseLoader } from "react-spinners";
import type {
  RecipePage,
  RecipePageContent,
  StandardError,
} from "../../../interfaces/interfaces";

interface RecipesListProps {
  data: RecipePage | null;
  isLoading: boolean;
  error: StandardError | string | null;
  isAdding: boolean;
  onLoadMore: (nextPage: number) => void;
  onDeleteItem: (item: RecipePageContent) => void;
  onEditItem: (item: RecipePageContent) => void;
  onAddItem?: (item: RecipePageContent) => void;
  onAddIngredients: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: (recipe: RecipePageContent) => void;
  userRole: string | null;
}

function RecipesList({
  data,
  isLoading,
  onLoadMore,
  onDeleteItem,
  onEditItem,
  isAdding,
  setSelectedItem,
  onAddIngredients,
  userRole,
}: RecipesListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const items = data?.content || [];
  const isLastPage = data?.last ?? true;
  const currentPage = data?.number ?? 0;
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 400);

  useEffect(() => {
    if (isLoading || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore(currentPage + 1);
        }
      },
      { threshold: 0.1 },
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

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isLoading && data !== null && items.length === 0) {
    return (
      <Alert variant="secondary" className="my-3 text-center">
        No recipes found.
      </Alert>
    );
  }

  return (
    <div
      className="ingredient-list-container mt-3 w-100 d-flex justify-content-center"
      style={{ minWidth: "200px" }}
    >
      <Row xs={1} sm={2} md={3} lg={4} className="g-4 w-100">
        {items.map((recipe) => {
          const {
            name,
            description,
            imageUrl,
            recipeId,
            difficulty,
            cost,
            cookingTime,
            preparationTime,
          } = recipe;

          return (
            <Col key={recipeId}>
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
                  <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                    <Card.Title className="mb-0 fs-6 fw-bold">
                      {name}
                    </Card.Title>
                    <Badge bg="warning" className=" text-dark">
                      {difficulty?.replace("_", " ")}
                    </Badge>
                  </div>

                  <Card.Text className="text-muted small flex-grow-1">
                    {description}
                  </Card.Text>

                  <div className="mt-auto border-top pt-2 small">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-semibold">Total Time:</span>
                      <span>
                        {(cookingTime || 0) + (preparationTime || 0)} mins
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
                      <span className="fw-semibold">Cost:</span>
                      <Badge
                        bg="secondary"
                        text="dark"
                        className="d-flex align-items-center"
                        style={{ maxHeight: "24px" }}
                      >
                        {cost}
                      </Badge>
                    </div>

                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        variant="outline-light"
                        size="sm"
                        className={`${isSmallScreen ? "w-100" : "w-50"} fw-semibold`}
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "keep-all",
                        }}
                        disabled={isAdding}
                        onClick={() => {
                          setSelectedItem(recipe);
                          onAddIngredients(true);
                        }}
                      >
                        {isAdding ? (
                          <PulseLoader color="#fff" size={6} />
                        ) : (
                          "Buy Ingredients"
                        )}
                      </Button>
                      {userRole === "ADMIN" && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="w-100 fw-semibold"
                          onClick={() => {
                            onEditItem(recipe);
                            setSelectedItem(recipe);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      {userRole === "ADMIN" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="w-100 fw-semibold"
                          onClick={() => {
                            onDeleteItem(recipe);
                            setSelectedItem(recipe);
                          }}
                        >
                          Delete
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

export default RecipesList;
