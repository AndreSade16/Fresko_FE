import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import type {
  PantryItemUpdateDTO,
  PantryPageContent,
} from "../../../interfaces/interfaces";
import { PulseLoader } from "react-spinners";

interface EditModalProps {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  selectedItem: PantryPageContent | null;
  onUpdateItem: (
    pantryItemId: string,
    editFormData: PantryItemUpdateDTO,
  ) => void;
}

const formatDateForInput = (
  dateValue: string | Date | null | undefined,
): string => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

function EditModal({
  showEditModal,
  setShowEditModal,
  selectedItem,
  onUpdateItem,
}: EditModalProps) {
  const [editFormData, setEditFormData] = useState<PantryItemUpdateDTO>({
    quantity: 0,
    purchaseDate: null,
    expirationDate: null,
    storageLocation: null,
  });

  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const isUpdating = false;

  const currentSelectedId = selectedItem ? selectedItem.pantryItemId : null;
  if (currentSelectedId !== prevSelectedId) {
    setPrevSelectedId(currentSelectedId);
    if (selectedItem) {
      setEditFormData({
        quantity: selectedItem.quantity,
        purchaseDate: selectedItem.purchaseDate,
        expirationDate: selectedItem.expirationDate,
        storageLocation: selectedItem.storageLocation,
      });
    }
  }

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" ? (value === "" ? null : parseFloat(value)) : value,
    }));
  };

  const handleEditSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (selectedItem && onUpdateItem) {
      onUpdateItem(selectedItem.pantryItemId, editFormData);
      setErrorMessage(null);
      setEditFormData({
        quantity: 0,
        purchaseDate: null,
        expirationDate: null,
        storageLocation: null,
      });
    }
    setShowEditModal(false);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setValidated(false);
    setErrorMessage(null);
  };

  return (
    <Modal
      show={showEditModal}
      onHide={handleClose}
      centered
      contentClassName="bg-primary text-light"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Edit Pantry Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="shadow-sm bg-primary text-light border-0">
          <Card.Body>
            <Card.Title className="mb-4 fs-5 fw-bold text-light">
              ✏️ Edit {selectedItem?.ingredientDefinition.name.toUpperCase()}
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

            <Form noValidate validated={validated} onSubmit={handleEditSubmit}>
              <Row className="g-3">
                {/* Quantity */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="quantity">
                    <Form.Label className="small text-muted mb-1">
                      Quantity
                    </Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        required
                        type="number"
                        min="0.01"
                        step="any"
                        name="quantity"
                        value={editFormData.quantity ?? ""}
                        placeholder="1"
                        onChange={handleEditChange}
                        className="bg-light text-dark border-secondary"
                      />
                      <InputGroup.Text className="bg-dark text-muted border-secondary">
                        {selectedItem?.ingredientDefinition.unit}
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
                      value={editFormData.storageLocation ?? "PANTRY"}
                      onChange={handleEditChange}
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
                      value={formatDateForInput(editFormData.purchaseDate)}
                      onChange={handleEditChange}
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
                      value={formatDateForInput(editFormData.expirationDate)}
                      onChange={handleEditChange}
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
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <PulseLoader color="#ffffff" size={8} />
                  ) : (
                    "Update Item"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

export default EditModal;
