import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiFetch } from "../../../tools/fetchHelper";
import {
  type IngredientDefinitionPageContent,
  type ShoppingListItemCreatedDTO,
  type StandardError,
} from "../../../interfaces/interfaces";
import { toast } from "react-toastify";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { GridLoader, PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import IngredientAddModal from "../../ingredients_page/IngredientAddModal/IngredientAddModal";
import IngredientEditModal from "../../ingredients_page/IngredientEditModal/IngredientEditModal";
import IngredientDeleteModal from "../../ingredients_page/IngredientDeleteModal/IngredientDeleteModal";

function IngredientDetails() {
  const navigate = useNavigate();

  const userRole = useSelector((state: RootState) => state.auth.role);
  const activeShoppingList = useSelector(
    (state: RootState) => state.shoppingList,
  );
  const { ingredientId } = useParams<{ ingredientId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [ingredient, setIngredient] =
    useState<IngredientDefinitionPageContent | null>(null);
  const [isImageValid, setIsImageValid] = useState<boolean>(true);

  const fetchIngredient = useCallback(async () => {
    if (!ingredientId) return;
    try {
      setIsLoading(true);
      const data = await apiFetch<IngredientDefinitionPageContent>(
        `/ingredients/${ingredientId}`,
      );
      setIngredient(data);
      setIsImageValid(true);
    } catch (error: unknown) {
      let message = `An error occurred while fetching the ingredient`;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [ingredientId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchIngredient();
  }, [fetchIngredient]);

  const handleAdd = async (quantity: number) => {
    const shoppingListId = activeShoppingList.data?.shoppingListId;

    if (!ingredient || !shoppingListId) {
      toast.error("Shopping list not found. Please try again.");
      return;
    }

    setIsAdding(true);
    const currentName = ingredient.name;

    try {
      await apiFetch<ShoppingListItemCreatedDTO>(
        "/shopping-lists/me/" + shoppingListId + "/items",
        {
          method: "POST",
          body: JSON.stringify({
            ingredientDefinitionId: ingredient.ingredientDefinitionId,
            suggestedQuantity: quantity,
          }),
        },
      );

      toast.success(`${currentName} added to your shopping list!`);
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsAdding(false);
      setShowAddModal(false);
    }
  };

  const handleDelete = async () => {
    if (!ingredient) return;

    try {
      setIsLoading(true);
      await apiFetch(`/ingredients/${ingredient.ingredientDefinitionId}`, {
        method: "DELETE",
      });
      toast.success(`${ingredient.name} deleted successfully.`);
      navigate(-1);
    } catch (error: unknown) {
      let message = "An error occurred while deleting the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center my-3">
      {isLoading && !ingredient ? (
        <GridLoader color="white" className="mt-5" />
      ) : (
        ingredient && (
          <Row className="w-100 d-flex justify-content-center">
            <Col
              sm={10}
              md={9}
              lg={8}
              className="d-flex justify-content-center"
            >
              <Card className="bg-primary w-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-2 fw-semibold">
                    {ingredient.name}
                  </Card.Title>
                  {ingredient.imageUrl && isImageValid && (
                    <div className="d-flex justify-content-center my-3">
                      <Card.Img
                        style={{ maxWidth: "300px" }}
                        src={ingredient.imageUrl}
                        onError={() => setIsImageValid(false)}
                      />
                    </div>
                  )}
                  <div className="d-flex gap-2 flex-wrap">
                    <Badge bg="secondary" text="dark">
                      {ingredient.category}
                    </Badge>
                    <Badge bg="warning" text="dark">
                      {ingredient.defaultStorageLocation === "REFRIGERATOR"
                        ? "FRIDGE"
                        : "PANTRY"}
                    </Badge>
                  </div>
                  <Card.Subtitle className="mt-2 mb-4 text-muted">
                    {ingredient.seasonality.join(", ")}
                  </Card.Subtitle>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between my-2 my-md-1 py-1 border-bottom border-1 border-opacity-25 border-light">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                      Description:
                    </Card.Text>
                    <Card.Text className="text-end">
                      {ingredient.description}
                    </Card.Text>
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between mt-2 mt-md-1 py-1 border-bottom border-1 border-opacity-25 border-light">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                      Alternative usages:
                    </Card.Text>
                    <Card.Text className="text-end">
                      {ingredient.alternativeUsages}
                    </Card.Text>
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between mt-2 mt-md-1 py-1 border-bottom border-1 border-opacity-25 border-light">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                      Shelf life days:
                    </Card.Text>
                    <span className="fw-normal fs-6 text-end">
                      {ingredient.shelfLifeDays}
                    </span>
                  </div>
                  <Card.Footer className="d-flex flex-column flex-md-row gap-2 mt-3 bg-transparent border-0">
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => setShowAddModal(true)}
                      disabled={isLoading || isAdding}
                    >
                      {isAdding ? <PulseLoader color="white" /> : "Add to List"}
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
      <IngredientAddModal
        showAddModal={showAddModal}
        onHide={() => setShowAddModal(false)}
        selectedItem={ingredient}
        onConfirmAdd={handleAdd}
        isAdding={isAdding}
      />
      {showEditModal && ingredient && (
        <IngredientEditModal
          key={ingredient.ingredientDefinitionId}
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          selectedItem={ingredient}
          onSuccess={fetchIngredient}
        />
      )}
      <IngredientDeleteModal
        show={showDeleteModal}
        selectedItem={ingredient}
        onHide={() => {
          setShowDeleteModal(false);
        }}
        onDelete={handleDelete}
        isAdding={isAdding}
      />
    </Container>
  );
}

export default IngredientDetails;
