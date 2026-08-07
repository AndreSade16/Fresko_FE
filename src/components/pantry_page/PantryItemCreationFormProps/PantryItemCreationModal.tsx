import { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Modal,
  ListGroup,
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  createPantryItem,
  fetchPantry,
} from "../../../redux/reducers/PantrySlice";
import { searchIngredientDefinitions } from "../../../redux/reducers/IngredientDefinitionSlice";
import type { IngredientDefinitionPageContent } from "../../../interfaces/interfaces";
import { SkewLoader } from "react-spinners";

export interface PantryItemDTO {
  ingredientDefinitionId: string;
  quantity: number;
  purchaseDate: string;
  expirationDate: string;
  storageLocation: "REFRIGERATOR" | "PANTRY" | "";
}

interface PantryItemCreationFormProps {
  onSuccess?: () => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

function PantryItemCreationModal({
  onSuccess,
  showCreateModal,
  setShowCreateModal,
}: PantryItemCreationFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<PantryItemDTO>({
    ingredientDefinitionId: "",
    quantity: 1,
    purchaseDate: new Date().toISOString().split("T")[0],
    expirationDate: "",
    storageLocation: "PANTRY",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: searchResults, isLoading: isSearching } = useSelector(
    (state: RootState) => state.ingredientDefinitions,
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    setFormData((prev) => ({ ...prev, ingredientDefinitionId: "" }));

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

  const handleSelectIngredient = (id: string, name: string) => {
    setFormData((prev) => ({ ...prev, ingredientDefinitionId: id }));
    setSearchTerm(name);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || !formData.ingredientDefinitionId) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setErrorMessage(null);

    try {
      await dispatch(createPantryItem(formData)).unwrap();
      await dispatch(fetchPantry());

      setFormData({
        ingredientDefinitionId: "",
        quantity: 1,
        purchaseDate: new Date().toISOString().split("T")[0],
        expirationDate: "",
        storageLocation: "PANTRY",
      });
      setSearchTerm("");
      setValidated(false);

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (typeof err === "string") {
        setErrorMessage(err);
      } else if (err && typeof err === "object" && "message" in err) {
        setErrorMessage(String((err as { message: unknown }).message));
      } else {
        setErrorMessage("An error occurred during saving.");
      }
    }
  };

  return (
    <Modal
      show={showCreateModal}
      onHide={() => {
        setShowCreateModal(false);
        setFormData({
          ingredientDefinitionId: "",
          quantity: 1,
          purchaseDate: new Date().toISOString().split("T")[0],
          expirationDate: "",
          storageLocation: "PANTRY",
        });
        setSearchTerm("");
        setShowDropdown(false);
      }}
      centered
      contentClassName="bg-primary text-light"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Create Pantry Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="shadow-sm bg-primary text-light border-0">
          <Card.Body>
            <Card.Title className="mb-4 fs-5 fw-bold text-light">
              ➕ Add new Ingredient in your Pantry
            </Card.Title>

            {errorMessage && (
              <Alert
                variant="danger"
                onClose={() => setErrorMessage(null)}
                dismissible
              >
                {errorMessage}
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* Search Bar Ingredient Definition */}
                <Col xs={12} className="position-relative">
                  <Form.Group controlId="ingredientSearch">
                    <Form.Label className="small text-muted mb-1">
                      Search Ingredient (min. 3 characters)
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="e.g. Tomato, Olive Oil..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      size="sm"
                      isInvalid={validated && !formData.ingredientDefinitionId}
                      autoComplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please search and select a valid ingredient from the list
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Dropdown menu for search results */}
                  {showDropdown && (
                    <ListGroup
                      className="position-absolute w-100 shadow-lg z-3 mt-1 overflow-auto"
                      style={{ maxHeight: "200px" }}
                    >
                      {isSearching ? (
                        <ListGroup.Item className="bg-dark text-light border-secondary text-center py-2">
                          <SkewLoader size={10} color="#36d7b7" /> Searching...
                        </ListGroup.Item>
                      ) : searchResults && searchResults.content.length > 0 ? (
                        searchResults.content.map(
                          (item: IngredientDefinitionPageContent) => (
                            <ListGroup.Item
                              key={item.ingredientDefinitionId}
                              action
                              onClick={() =>
                                handleSelectIngredient(
                                  item.ingredientDefinitionId,
                                  item.name,
                                )
                              }
                              className="bg-dark text-light border-secondary hover-overlay"
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

                {/* Quantity */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="quantity">
                    <Form.Label className="small text-muted mb-1">
                      Quantity
                    </Form.Label>
                    <InputGroup
                      size="sm"
                      className={
                        !formData.ingredientDefinitionId ? "opacity-50" : ""
                      }
                    >
                      <Form.Control
                        required
                        type="number"
                        min="0.01"
                        step="any"
                        name="quantity"
                        value={
                          formData.ingredientDefinitionId
                            ? formData.quantity
                            : ""
                        }
                        placeholder={
                          !formData.ingredientDefinitionId
                            ? "Select an ingr. first..."
                            : "1"
                        }
                        onChange={handleChange}
                        disabled={!formData.ingredientDefinitionId}
                        className="bg-light text-dark border-secondary"
                      />
                      <InputGroup.Text className="bg-dark text-muted border-secondary">
                        {searchResults?.content.find(
                          (item) =>
                            item.ingredientDefinitionId ===
                            formData.ingredientDefinitionId,
                        )?.unit || "-"}
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      Insert a positive amount
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Storage Location */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="storageLocation">
                    <Form.Label className="small text-muted mb-1">
                      Storage location
                    </Form.Label>
                    <Form.Select
                      required
                      name="storageLocation"
                      value={formData.storageLocation}
                      onChange={handleChange}
                      size="sm"
                    >
                      <option value="PANTRY">Pantry</option>
                      <option value="REFRIGERATOR">Fridge</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Select a valid storage location
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Purchase date */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="purchaseDate">
                    <Form.Label className="small text-muted mb-1">
                      Purchase date
                    </Form.Label>
                    <Form.Control
                      required
                      type="date"
                      name="purchaseDate"
                      max={new Date().toISOString().split("T")[0]}
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      size="sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      Purchase date can't be in the future
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Expiration Date */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="expirationDate">
                    <Form.Label className="small text-muted mb-1">
                      Expiration date
                    </Form.Label>
                    <Form.Control
                      required
                      type="date"
                      name="expirationDate"
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.expirationDate}
                      onChange={handleChange}
                      size="sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      Expiration date must be present or future
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="fw-semibold px-4"
                >
                  Add Item
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

export default PantryItemCreationModal;
