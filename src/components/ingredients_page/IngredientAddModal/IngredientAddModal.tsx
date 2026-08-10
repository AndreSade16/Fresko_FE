import { Button, Form, Modal } from "react-bootstrap";
import type { IngredientDefinitionPageContent } from "../../../interfaces/interfaces";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

interface IngredientAddModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  selectedItem: IngredientDefinitionPageContent | null;
  onConfirmAdd: (quantity: number) => void;
  isAdding: boolean;
}

function IngredientAddModal({
  showAddModal,
  setShowAddModal,
  selectedItem,
  onConfirmAdd,
  isAdding,
}: IngredientAddModalProps) {
  const [quantity, setQuantity] = useState<number | "">(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuantity(val === "" ? "" : Number(val));
  };

  const handleConfirm = () => {
    onConfirmAdd(quantity === "" ? 0 : quantity);
    setShowAddModal(false);
  };

  return (
    <Modal
      show={showAddModal}
      onHide={() => setShowAddModal(false)}
      centered
      contentClassName="bg-primary text-light"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Confirm Add</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Do you want to add <strong>{selectedItem?.name}</strong> to your
          shopping list?
        </p>

        <Form.Group controlId="ingredientQuantity" className="mt-3">
          <Form.Label>Quantity ({selectedItem?.unit || "units"}):</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-light"
          onClick={() => setShowAddModal(false)}
          disabled={isAdding}
        >
          {isAdding ? <PulseLoader /> : "Cancel"}
        </Button>
        <Button variant="warning" onClick={handleConfirm} disabled={isAdding}>
          {isAdding ? <PulseLoader /> : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default IngredientAddModal;
