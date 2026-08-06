import { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import {
  createPantryItem,
  fetchPantry,
} from "../../../redux/reducers/PantrySlice";

export interface PantryItemDTO {
  ingredientDefinitionId: string;
  quantity: number;
  purchaseDate: string;
  expirationDate: string;
  storageLocation: "REFRIGERATOR" | "PANTRY" | "";
}

interface PantryItemCreationFormProps {
  onSuccess?: () => void;
}

function PantryItemCreationForm({ onSuccess }: PantryItemCreationFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<PantryItemDTO>({
    ingredientDefinitionId: "",
    quantity: 1,
    purchaseDate: new Date().toISOString().split("T")[0], // Data di oggi di default
    expirationDate: "",
    storageLocation: "PANTRY",
  });

  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
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
    <Card className="shadow-sm bg-dark text-light border-0">
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
            {/* Ingredient Definition UUID */}
            <Col xs={12}>
              <Form.Group controlId="ingredientDefinitionId">
                <Form.Label className="small text-muted mb-1">
                  ID Ingredient Definition (UUID)
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="ingredientDefinitionId"
                  placeholder="es. 123e4567-e89b-12d3-a456-426614174000"
                  value={formData.ingredientDefinitionId}
                  onChange={handleChange}
                  size="sm"
                />
                <Form.Control.Feedback type="invalid">
                  You must enter the ingredient ID
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Quantity */}
            <Col xs={12} md={6}>
              <Form.Group controlId="quantity">
                <Form.Label className="small text-muted mb-1">
                  Quantity
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min="0.01"
                  step="any"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  size="sm"
                />
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

            {/* Data di Scadenza */}
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
              variant="light"
              size="sm"
              className="fw-semibold px-4"
            >
              Add Item
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PantryItemCreationForm;
