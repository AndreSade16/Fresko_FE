import { useState, useRef, useEffect } from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
  Row,
  Col,
  ListGroup,
  InputGroup,
  Table,
} from "react-bootstrap";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import type { IngredientDefinitionPageContent } from "../../../../interfaces/interfaces";
import { searchIngredientDefinitions } from "../../../../redux/reducers/IngredientDefinitionSlice";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { apiFetch } from "../../../../tools/fetchHelper";
import { toast } from "react-toastify";

interface CreateRecipeModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: (recipeId: string) => void;
}

interface RecipeCreatedDTO {
  recipeId: string;
}

interface SelectedIngredientItem {
  ingredientDefinitionId: string;
  name: string;
  unit: string;
  quantityPerPerson: number;
}

function CreateRecipeModal({
  show,
  onHide,
  onSuccess,
}: CreateRecipeModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preparationTime, setPreparationTime] = useState<number | "">("");
  const [cookingTime, setCookingTime] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [cost, setCost] = useState("CHEAP");
  const [procedure, setProcedure] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientDefinitionPageContent | null>(null);
  const [quantityPerPerson, setQuantityPerPerson] = useState<number | "">("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ingredientsList, setIngredientsList] = useState<
    SelectedIngredientItem[]
  >([]);

  const { data: searchResults, isLoading: isSearching } = useSelector(
    (state: RootState) => state.ingredientDefinitions,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPreparationTime("");
    setCookingTime("");
    setDifficulty("EASY");
    setCost("CHEAP");
    setProcedure("");
    setImageFile(null);
    setSearchTerm("");
    setSelectedIngredient(null);
    setQuantityPerPerson("");
    setShowDropdown(false);
    setIngredientsList([]);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIngredient(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length >= 3) {
      debounceTimerRef.current = setTimeout(() => {
        dispatch(searchIngredientDefinitions(value));
        setShowDropdown(true);
      }, 500);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectIngredient = (item: IngredientDefinitionPageContent) => {
    setSelectedIngredient(item);
    setSearchTerm(item.name);
    setShowDropdown(false);
  };

  const handleAddIngredientToList = () => {
    if (!selectedIngredient) {
      setError("Please search and select a valid ingredient first.");
      return;
    }
    if (!quantityPerPerson || Number(quantityPerPerson) <= 0) {
      setError("Please specify a valid quantity per person.");
      return;
    }

    if (
      ingredientsList.some(
        (i) =>
          i.ingredientDefinitionId ===
          selectedIngredient.ingredientDefinitionId,
      )
    ) {
      setError("This ingredient is already in the list.");
      return;
    }

    setIngredientsList((prev) => [
      ...prev,
      {
        ingredientDefinitionId: selectedIngredient.ingredientDefinitionId,
        name: selectedIngredient.name,
        unit: selectedIngredient.unit || "",
        quantityPerPerson: Number(quantityPerPerson),
      },
    ]);

    setSearchTerm("");
    setSelectedIngredient(null);
    setQuantityPerPerson("");
    setError(null);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredientsList((prev) =>
      prev.filter((item) => item.ingredientDefinitionId !== id),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!imageFile) {
      setError("Please select a recipe image.");
      return;
    }

    if (ingredientsList.length === 0) {
      setError("Please add at least one ingredient to the recipe.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("recipeImage", imageFile);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("preparationTime", String(preparationTime));
      formData.append("cookingTime", String(cookingTime));
      formData.append("difficulty", difficulty);
      formData.append("cost", cost);
      formData.append("procedure", procedure);

      const recipeRes = await apiFetch<RecipeCreatedDTO>("/recipes", {
        method: "POST",
        body: formData,
      });

      const newRecipeId = recipeRes.recipeId;

      try {
        await Promise.all(
          ingredientsList.map((item) =>
            apiFetch(`/recipes/${newRecipeId}/ingredients`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ingredientDefinitionId: item.ingredientDefinitionId,
                quantityPerPerson: item.quantityPerPerson,
              }),
            }),
          ),
        );
        toast.success("Recipe correctly created!");
      } catch {
        try {
          await apiFetch<void>(`/recipes/${newRecipeId}`, { method: "DELETE" });
        } catch {
          toast.error("Error deleting partial recipe. Delete it manually");
        }
      }

      resetForm();
      if (onSuccess) onSuccess(newRecipeId);
      onHide();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "An error occurred while creating the recipe or adding ingredients.",
        );
      }
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-primary text-light border-bottom border-light border-opacity-25"
      >
        <Modal.Title className="fs-5 fw-bold">Create New Recipe</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} className="bg-primary text-light">
        <Modal.Body
          className="p-4"
          style={{ maxHeight: "75vh", overflowY: "auto" }}
        >
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Row className="g-3">
            <Col xs={12}>
              <Form.Group controlId="recipeName">
                <Form.Label className="fw-semibold">Recipe Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Carbonara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={3}
                  isInvalid={name.length > 0 && name.length < 3}
                  required
                />
                {name.length > 0 && (
                  <Form.Control.Feedback type="invalid">
                    Name must be between 3 and 255 characters long
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="recipeDescription">
                <Form.Label className="fw-semibold">
                  Description <small>(max 255 characters)</small>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Short overview..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minLength={3}
                  required
                  isInvalid={
                    description.length > 0 &&
                    (description.length < 3 || description.length > 255)
                  }
                />
                {description.length > 0 && (
                  <Form.Control.Feedback type="invalid">
                    Description must be between 3 and 255 characters long
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="prepTime">
                <Form.Label className="fw-semibold">
                  Preparation Time (mins)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  placeholder="e.g. 15"
                  value={preparationTime}
                  onChange={(e) =>
                    setPreparationTime(
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="cookingTime">
                <Form.Label className="fw-semibold">
                  Cooking Time (mins)
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="e.g. 20"
                  value={cookingTime}
                  onChange={(e) =>
                    setCookingTime(e.target.value ? Number(e.target.value) : "")
                  }
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="recipeDifficulty">
                <Form.Label className="fw-semibold">Difficulty</Form.Label>
                <Form.Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="VERY_EASY">VERY EASY</option>
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="recipeCost">
                <Form.Label className="fw-semibold">Cost</Form.Label>
                <Form.Select
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                >
                  <option value="CHEAP">CHEAP</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="EXPENSIVE">EXPENSIVE</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="recipeImage">
                <Form.Label className="fw-semibold">Recipe Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="recipeProcedure">
                <Form.Label className="fw-semibold">
                  Procedure / Instructions
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Step-by-step instructions (min 10 characters)..."
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  minLength={10}
                  isInvalid={procedure.length > 0 && procedure.length < 10}
                  required
                />
                {procedure.length > 0 && (
                  <Form.Control.Feedback type="invalid">
                    Procedure must be at least 10 characters long
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            {/* SEZIONE GESTIONE INGREDIENTI */}
            <Col xs={12}>
              <hr className="my-4 border-light opacity-25" />
              <h5 className="fw-bold mb-3 text-warning">
                Add Recipe Ingredients
              </h5>
            </Col>

            {/* Ricerca ingrediente */}
            <Col xs={12} md={7} className="position-relative">
              <Form.Group controlId="ingredientSearch">
                <Form.Label className="small text-light">
                  Search Ingredient (min. 3 characters)
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Spaghetti, Guanciale..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoComplete="off"
                />
              </Form.Group>

              {/* Dropdown dei risultati */}
              {showDropdown && (
                <ListGroup
                  className="position-absolute w-100 shadow-lg z-3 mt-1 overflow-auto"
                  style={{ maxHeight: "200px" }}
                >
                  {isSearching ? (
                    <ListGroup.Item className="bg-dark text-light border-secondary text-center py-2">
                      <PulseLoader size={8} color="#36d7b7" /> Searching...
                    </ListGroup.Item>
                  ) : searchResults && searchResults.content.length > 0 ? (
                    searchResults.content.map(
                      (item: IngredientDefinitionPageContent) => (
                        <ListGroup.Item
                          key={item.ingredientDefinitionId}
                          action
                          onClick={() => handleSelectIngredient(item)}
                          className="bg-dark text-light border-secondary"
                        >
                          <div className="fw-semibold">{item.name}</div>
                          {item.category && (
                            <small className="text-muted d-block">
                              {item.category}
                            </small>
                          )}
                        </ListGroup.Item>
                      ),
                    )
                  ) : (
                    <ListGroup.Item className="bg-dark text-muted border-secondary py-2">
                      No ingredients found
                    </ListGroup.Item>
                  )}
                </ListGroup>
              )}
            </Col>

            {/* Quantità per persona + Bottone Aggiungi */}
            <Col xs={12} md={5}>
              <Form.Group controlId="quantityPerPerson">
                <Form.Label className="small text-light">
                  Quantity per person
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="e.g. 100"
                    value={quantityPerPerson}
                    onChange={(e) =>
                      setQuantityPerPerson(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    disabled={!selectedIngredient}
                  />
                  <InputGroup.Text className="bg-dark text-light border-secondary">
                    {selectedIngredient?.unit || "-"}
                  </InputGroup.Text>
                  <Button
                    variant="warning"
                    className="fw-semibold text-dark"
                    onClick={handleAddIngredientToList}
                    disabled={!selectedIngredient}
                  >
                    + Add
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col xs={12}>
              {ingredientsList.length > 0 ? (
                <Table
                  responsive
                  striped
                  bordered
                  hover
                  variant="dark"
                  className="mt-3 align-middle"
                >
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Qty per Person</th>
                      <th className="text-center" style={{ width: "80px" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientsList.map((item) => (
                      <tr key={item.ingredientDefinitionId}>
                        <td className="fw-semibold">{item.name}</td>
                        <td>
                          {item.quantityPerPerson} {item.unit}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveIngredient(
                                item.ingredientDefinitionId,
                              )
                            }
                          >
                            ✕
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="p-3 text-center border border-dashed border-light border-opacity-25 rounded mt-2 text-light text-opacity-75">
                  <small>
                    No ingredients added yet. Search and add at least one.
                  </small>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-top border-light border-opacity-25">
          <Button
            variant="outline-light"
            onClick={handleClose}
            disabled={isLoading}
          >
            {isLoading ? <PulseLoader color="white" size={8} /> : "Cancel"}
          </Button>
          <Button
            variant="outline-warning"
            type="submit"
            className="fw-semibold d-inline-flex align-items-center justify-content-center"
            style={{ minWidth: "140px", height: "38px" }}
            disabled={isLoading}
          >
            {isLoading ? <PulseLoader color="white" size={8} /> : "Save Recipe"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateRecipeModal;
