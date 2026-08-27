import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
} from "react-bootstrap";
import { GridLoader, PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import type {
  RecipeIngredientsToSlDTO,
  RecipePageContent,
  StandardError,
} from "../../../interfaces/interfaces";
import { apiFetch } from "../../../tools/fetchHelper";
import RecipeEditModal from "../../recipes_page/RecipeEditModal/RecipeEditModal";
import RecipeDeleteModal from "../../recipes_page/RecipeDeleteModal/RecipeDeleteModal";
import RecipeToSlAddModal from "../../recipes_page/RecipeToSlModal/RecipeToSlModal";

function RecipeDetails() {
  const navigate = useNavigate();

  const userRole = useSelector((state: RootState) => state.auth.role);

  const { recipeId } = useParams<{ recipeId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<RecipePageContent | null>(null);
  const [isImageValid, setIsImageValid] = useState<boolean>(true);

  const fetchRecipe = useCallback(async () => {
    if (!recipeId) return;
    try {
      setIsLoading(true);
      const data = await apiFetch<RecipePageContent>(`/recipes/${recipeId}`);
      setRecipe(data);
      setIsImageValid(true);
    } catch (error: unknown) {
      let message = `An error occurred while fetching the recipe`;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRecipe();
  }, [fetchRecipe]);

  const handleDelete = async () => {
    if (!recipe) return;

    try {
      setIsLoading(true);
      await apiFetch(`/recipes/${recipe.recipeId}`, {
        method: "DELETE",
      });
      toast.success(`${recipe.name} deleted successfully.`);
      navigate(-1);
    } catch (error: unknown) {
      let message = "An error occurred while deleting the recipe.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIngredients = async (
    recipe: RecipePageContent,
    numOfPeople: string,
  ) => {
    setIsAdding(true);

    try {
      const response = await apiFetch<RecipeIngredientsToSlDTO>(
        `/recipes/${recipe.recipeId}/${numOfPeople}`,
        {
          method: "POST",
        },
      );

      if (response.shoppingListItems.length > 0) {
        toast.success("Recipe ingredients are now in your shopping list!");
      }
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setShowAddModal(false);
      setIsAdding(false);
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center my-3">
      {isLoading && !recipe ? (
        <GridLoader color="white" className="mt-5" />
      ) : (
        recipe && (
          <Row className="w-100 d-flex justify-content-center">
            <Col
              sm={10}
              md={8}
              lg={6}
              className="d-flex justify-content-center"
            >
              <Card className="bg-primary w-100" style={{ minWidth: "200px" }}>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-2 fw-semibold">
                    {recipe.name}
                  </Card.Title>
                  {recipe.imageUrl && isImageValid && (
                    <div className="d-flex justify-content-center my-3">
                      <Card.Img
                        style={{ maxWidth: "300px" }}
                        src={recipe.imageUrl}
                        onError={() => setIsImageValid(false)}
                      />
                    </div>
                  )}
                  <div className="d-flex flex-wrap gap-3 justify-content-around mb-3">
                    <div className="d-flex flex-nowrap gap-1">
                      <span className="fw-semibold">Cost:</span>
                      <Badge
                        bg="secondary"
                        text="dark"
                        className="d-flex align-items-center"
                      >
                        {recipe.cost}
                      </Badge>
                    </div>
                    <div className="d-flex flex-nowrap gap-1">
                      <span className="fw-semibold">Difficulty:</span>
                      <Badge
                        bg="warning"
                        text="dark"
                        className="d-flex align-items-center"
                      >
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Card.Subtitle className="mt-2 mb-4 text-muted text-center">
                    {recipe.description}
                  </Card.Subtitle>
                  {recipe.ingredients.length > 0 && (
                    <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start justify-content-md-between py-3 border-bottom border-1 border-opacity-25 border-light gap-md-4">
                      <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                        Ingredients:
                      </Card.Text>
                      <ListGroup className="w-75">
                        {recipe.ingredients.map((ingredient) => (
                          <ListGroup.Item
                            variant="light"
                            className="d-flex justify-content-between bg-dark text-light"
                          >
                            <span
                              className="fw-semibold"
                              style={{ maxWidth: "50%" }}
                            >
                              {ingredient.ingredientDefinition.name}:
                            </span>
                            <span
                              className="d-flex align-items-center"
                              style={{ maxWidth: "30%" }}
                            >
                              {ingredient.quantityPerPerson}
                              {ingredient.ingredientDefinition.unit === "GRAMS"
                                ? "g"
                                : ingredient.ingredientDefinition.unit ===
                                    "MILLILITERS"
                                  ? "ml"
                                  : "uts"}
                            </span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                  <div className="d-flex flex-column flex-md-row justify-content-md-between border-bottom border-1 border-opacity-25 border-light py-3">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                      Preparation time:
                    </Card.Text>
                    <Card.Text className="text-end d-flex align-items-center">
                      {recipe.preparationTime} mins
                    </Card.Text>
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between border-bottom border-1 border-opacity-25 border-light py-3">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                      Cooking time:
                    </Card.Text>
                    <Card.Text className="text-sm-end d-flex align-items-center">
                      {recipe.cookingTime} mins
                    </Card.Text>
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between py-3 border-bottom border-1 border-opacity-25 border-light gap-0 gap-md-5">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-start">
                      Procedure:
                    </Card.Text>
                    <Card.Text
                      className="text-md-end"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {recipe.procedure}
                    </Card.Text>
                  </div>
                  <Card.Footer className="d-flex flex-column flex-md-row gap-2 mt-3 bg-transparent border-0">
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => setShowAddModal(true)}
                      disabled={isLoading || isAdding}
                    >
                      {isAdding ? (
                        <PulseLoader color="white" />
                      ) : (
                        "Buy Ingredients"
                      )}
                    </Button>

                    {userRole === "ADMIN" && (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="w-100 fw-semibold"
                        onClick={() => setShowEditModal(true)}
                        disabled={isLoading || isAdding}
                      >
                        {isAdding ? <PulseLoader color="white" /> : "Edit"}
                      </Button>
                    )}
                    {userRole === "ADMIN" && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="w-100 fw-semibold"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isLoading || isAdding}
                      >
                        {isAdding ? <PulseLoader color="white" /> : "Delete"}
                      </Button>
                    )}
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )
      )}
      <Button
        className="mt-4 fw-semibold"
        variant="outline-secondary"
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>
      <RecipeToSlAddModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        selectedItem={recipe}
        isAdding={isAdding}
        onConfirmAdd={handleAddIngredients}
      />
      {showEditModal && recipe && (
        <RecipeEditModal
          key={recipe.recipeId}
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          selectedItem={recipe}
          onSuccess={fetchRecipe}
        />
      )}
      <RecipeDeleteModal
        show={showDeleteModal}
        selectedItem={recipe}
        onHide={() => {
          setShowDeleteModal(false);
        }}
        onDelete={handleDelete}
        isAdding={isAdding}
      />
    </Container>
  );
}

export default RecipeDetails;
