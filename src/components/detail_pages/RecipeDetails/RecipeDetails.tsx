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
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../redux/store";
import type {
  RecipeIngredientsToSlDTO,
  RecipePageContent,
  StandardError,
} from "../../../interfaces/interfaces";
import { apiFetch } from "../../../tools/fetchHelper";
import RecipeEditModal from "../../recipes_page/RecipeEditModal/RecipeEditModal";
import RecipeDeleteModal from "../../recipes_page/RecipeDeleteModal/RecipeDeleteModal";
import RecipeToSlAddModal from "../../recipes_page/RecipeToSlModal/RecipeToSlModal";
import RecipePrepareModal from "../../recipes_page/RecipePrepareModal/RecipePrepareModal";
import { createActiveShoppingList } from "../../../redux/reducers/ShoppingListSlice";
import { fetchUserProfile } from "../../../redux/reducers/UserSlice";
import AddMissingIngredientsModal from "../../recipes_page/AddMissingIngredientsModal/AddMissingIngredientsModal";

function RecipeDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userRole = useSelector((state: RootState) => state.auth.role);
  const pantryItems = useSelector((state: RootState) => state.user.pantryItems);

  const { recipeId } = useParams<{ recipeId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddMissingModal, setShowAddMissingModal] =
    useState<boolean>(false);
  const [showPrepareModal, setShowPrepareModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recipe, setRecipe] = useState<RecipePageContent | null>(null);
  const [isImageValid, setIsImageValid] = useState<boolean>(true);

  const fetchRecipe = useCallback(async () => {
    if (!recipeId) return;
    try {
      setIsLoading(true);
      const data = await apiFetch<RecipePageContent>(
        `/recipes/${recipeId}/visit`,
      );
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

  const getPossessedIngredients = (recipe: RecipePageContent) => {
    return recipe.ingredients.filter((ingredient) =>
      pantryItems?.some(
        (pantryItem) =>
          pantryItem.ingredientDefinition.ingredientDefinitionId ===
          ingredient.ingredientDefinition.ingredientDefinitionId,
      ),
    );
  };

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
    await dispatch(createActiveShoppingList());

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

  const handleAddMissingIngredients = async (
    recipe: RecipePageContent,
    numOfPeople: string,
  ) => {
    setIsAdding(true);
    await dispatch(createActiveShoppingList());

    try {
      const response = await apiFetch<RecipeIngredientsToSlDTO>(
        `/recipes/${recipe.recipeId}/remaining/${numOfPeople}`,
        {
          method: "POST",
        },
      );

      if (response.shoppingListItems.length > 0) {
        toast.success(
          "Missing recipe ingredients are now in your shopping list!",
        );
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

  const handlePrepare = async (
    selectedRecipe: RecipePageContent | null,
    peopleCount: number,
  ) => {
    if (!selectedRecipe || peopleCount <= 0) return;
    setIsAdding(true);

    try {
      await apiFetch(`/recipes/${recipeId}?peopleCount=${peopleCount}`, {
        method: "POST",
      });
      toast.success(`${recipe?.name} successfully prepared!`);
      setShowPrepareModal(false);
      dispatch(fetchUserProfile());
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
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
                  <Card.Text
                    className="text-secondary text-center fw-semibold mt-auto"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    You already possess {getPossessedIngredients(recipe).length}{" "}
                    of {recipe.ingredients.length} ingredients
                  </Card.Text>
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
                              className={
                                getPossessedIngredients(recipe).includes(
                                  ingredient,
                                )
                                  ? "fw-semibold text-secondary"
                                  : "fw-semibold"
                              }
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
                                  : "units"}
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
                        "Buy All Ingredients"
                      )}
                    </Button>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => setShowAddMissingModal(true)}
                      disabled={isLoading || isAdding}
                    >
                      {isAdding ? (
                        <PulseLoader color="white" />
                      ) : (
                        "Buy Missing Ingredients"
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => setShowPrepareModal(true)}
                      disabled={isLoading || isAdding}
                    >
                      {isAdding ? <PulseLoader color="white" /> : "Prepare!"}
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
      <AddMissingIngredientsModal
        showAddMissingModal={showAddMissingModal}
        setShowAddMissingModal={setShowAddMissingModal}
        selectedItem={recipe}
        isAdding={isAdding}
        onConfirmAdd={handleAddMissingIngredients}
      />
      <RecipePrepareModal
        show={showPrepareModal}
        selectedRecipe={recipe}
        onHide={() => setShowPrepareModal(false)}
        onPrepare={handlePrepare}
        isAdding={isAdding || isLoading}
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
