import { Button, Form, Modal } from "react-bootstrap";
import type { RecipePageContent } from "../../../interfaces/interfaces";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

interface RecipeToSlAddModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  selectedItem: RecipePageContent | null;
  onConfirmAdd: (selectedItem: RecipePageContent, numOfPeople: string) => void;
  isAdding: boolean;
}

function RecipeToSlAddModal({
  showAddModal,
  setShowAddModal,
  selectedItem,
  onConfirmAdd,
  isAdding,
}: RecipeToSlAddModalProps) {
  const [servings, setServings] = useState<number | "">(1);

  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setServings("");
      return;
    }

    const numVal = Number(val);

    if (numVal > 20) {
      setServings(20);
    } else if (numVal < 1) {
      setServings(1);
    } else {
      setServings(numVal);
    }
  };

  const handleConfirm = () => {
    if (!selectedItem) return;
    onConfirmAdd(selectedItem, servings.toString());
    setShowAddModal(false);
    setServings(1);
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
          <Form.Label>Number of servings: (20 max)</Form.Label>
          <Form.Control
            type="number"
            value={servings}
            onChange={handleServingsChange}
            max={20}
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
        <Button
          variant="warning"
          onClick={() => {
            handleConfirm();
            setServings(1);
          }}
          disabled={isAdding}
        >
          {isAdding ? <PulseLoader /> : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeToSlAddModal;
