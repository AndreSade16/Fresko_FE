import { useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import { Alert, Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import { PulseLoader } from "react-spinners";
import type {
  PantryPageContent,
  RecipePage,
  RecipePageContent,
  StandardError,
} from "../../../interfaces/interfaces";
import { useNavigate } from "react-router";

interface PersonalRecipesListProps {
  data: RecipePage | null;
  isLoading: boolean;
  error: StandardError | string | null;
  isAdding: boolean;
  onLoadMore: (nextPage: number) => void;
  onDeleteItem: (item: RecipePageContent) => void;
  onEditItem: (item: RecipePageContent) => void;
  onPrepareItem: (item: RecipePageContent) => void;
  onAddItem?: (item: RecipePageContent) => void;
  onAddIngredients: Dispatch<SetStateAction<boolean>>;
  onAddMissing: () => void;
  setSelectedItem: (recipe: RecipePageContent) => void;
  userRole: string | null;
  pantryItems: PantryPageContent[] | null;
}

function PersonalRecipesList({
  data,
  isLoading,
  onLoadMore,
  onDeleteItem,
  onEditItem,
  isAdding,
  setSelectedItem,
  onAddIngredients,
  onPrepareItem,
  onAddMissing,
  pantryItems,
}: PersonalRecipesListProps) {
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const items = data?.content || [];
  const isLastPage = data?.last ?? true;
  const currentPage = data?.number ?? 0;

  const stateRef = useRef({ isLoading, isLastPage, currentPage, onLoadMore });
  useEffect(() => {
    stateRef.current = { isLoading, isLastPage, currentPage, onLoadMore };
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const { isLoading, isLastPage, currentPage, onLoadMore } =
          stateRef.current;
        if (entries[0].isIntersecting && !isLoading && !isLastPage) {
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
  }, []);

  const getPossessedIngredients = (recipe: RecipePageContent) => {
    return recipe.ingredients.filter((ingredient) =>
      pantryItems?.some(
        (pantryItem) =>
          pantryItem.ingredientDefinition.ingredientDefinitionId ===
          ingredient.ingredientDefinition.ingredientDefinitionId,
      ),
    );
  };

  if (!isLoading && data !== null && items.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center">
        <Alert
          variant="warning"
          className="my-3 text-center border-black shadow d-flex flex-column flex-sm-row align-items-sm-center gap-2"
        >
          <Image
            src="/ni-open-box.svg"
            className="h-100"
            style={{
              minHeight: "100px",
              maxHeight: "20px",
            }}
            alt=""
          />
          <span className="text-black">No recipe saved yet.</span>
        </Alert>
        <Button
          variant="secondary"
          className="border-black fw-semibold z-1"
          onClick={() => navigate("/recipes")}
        >
          Explore the Recipes
        </Button>
      </div>
    );
  }

  return (
    <div
      className="ingredient-list-container mt-3 w-100"
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
              <Card
                className="h-100 shadow-sm hover-card bg-primary position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/recipes/${recipeId}`)}
              >
                <Badge
                  className="position-absolute  p-2 bg-warning text-black d-flex align-items-center justify-content-center border border-black"
                  aria-label={"Remove " + name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(recipe);
                    setSelectedItem(recipe);
                  }}
                  style={{
                    top: "-10px",
                    right: "-10px",
                  }}
                >
                  <i className="bi bi-bookmark-x fs-2 fw-bold"></i>
                </Badge>
                {imageUrl && (
                  <Card.Img
                    variant="top"
                    src={imageUrl}
                    alt={name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div className="d-flex flex-column justify-content-between flex-grow-1 mb-2">
                    <div className="d-flex flex-column justify-content-between align-items-start mb-2 flex-wrap gap-2">
                      <Card.Title
                        className="mb-0 fs-6 fw-bold"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.5em",
                        }}
                      >
                        {name}
                      </Card.Title>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex gap-2 mb-1">
                        <span className="fw-semibold fs-6">Difficulty:</span>
                        <Badge
                          bg="warning"
                          className=" text-dark d-flex align-items-center"
                        >
                          {difficulty?.replace("_", " ")}
                        </Badge>
                      </div>
                      <Card.Text
                        className="text-muted small mt-auto"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {description}
                      </Card.Text>
                    </div>
                  </div>

                  <div className=" border-top pt-2 small">
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

                    {pantryItems && (
                      <Card.Text
                        className="text-secondary mt-auto"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        You already possess{" "}
                        {getPossessedIngredients(recipe).length} of{" "}
                        {recipe.ingredients.length} ingredients
                      </Card.Text>
                    )}

                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="w-100 fw-semibold"
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "keep-all",
                        }}
                        disabled={isAdding}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(recipe);
                          onAddIngredients(true);
                        }}
                      >
                        {isAdding ? (
                          <PulseLoader color="#fff" size={6} />
                        ) : (
                          "Buy All Ingredients"
                        )}
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="w-100 fw-semibold"
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "keep-all",
                        }}
                        disabled={
                          isAdding ||
                          pantryItems?.length === 0 ||
                          getPossessedIngredients(recipe).length === 0
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(recipe);
                          onAddMissing();
                        }}
                      >
                        {isAdding ? (
                          <PulseLoader color="#fff" size={6} />
                        ) : (
                          "Buy Missing Ingredients"
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="w-100 fw-semibold"
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "keep-all",
                        }}
                        disabled={isAdding}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(recipe);
                          onPrepareItem(recipe);
                        }}
                      >
                        {isAdding ? (
                          <PulseLoader color="#fff" size={6} />
                        ) : (
                          "Prepare"
                        )}
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="w-100 fw-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem(recipe);
                          setSelectedItem(recipe);
                        }}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <PulseLoader color="#fff" size={6} />
                        ) : (
                          "Edit"
                        )}
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

export default PersonalRecipesList;
