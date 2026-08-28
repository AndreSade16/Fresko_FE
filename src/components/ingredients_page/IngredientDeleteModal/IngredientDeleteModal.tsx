import { Button, Modal } from "react-bootstrap";
import type { IngredientDefinitionPageContent } from "../../../interfaces/interfaces";
import { PulseLoader } from "react-spinners";

interface IngredientDeleteModalProps {
  show: boolean;
  selectedItem: IngredientDefinitionPageContent | null;
  onHide: () => void;
  onDelete: (selectedItem: IngredientDefinitionPageContent | null) => void;
  isAdding: boolean;
}

function IngredientDeleteModal({
  show,
  selectedItem,
  onHide,
  onDelete,
  isAdding,
}: IngredientDeleteModalProps) {
  return (
    <Modal
      show={show}
      backdrop="static"
      centered
      contentClassName="bg-primary text-light"
      onHide={onHide}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Delete Ingredient {selectedItem?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <b>{selectedItem?.name}</b>?<br />
        Every recipe containing <b>{selectedItem?.name}</b> will be deleted as
        well!
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-light"
          className="fw-semibold d-inline-flex align-items-center justify-content-center"
          style={{ minWidth: "140px", height: "38px" }}
          onClick={onHide}
          disabled={isAdding}
        >
          {isAdding ? (
            <div className="d-flex align-items-center justify-content-center">
              <PulseLoader color="white" size={10} />
            </div>
          ) : (
            "Cancel"
          )}
        </Button>
        <Button
          variant="outline-danger"
          className="fw-semibold d-inline-flex align-items-center justify-content-center"
          style={{ minWidth: "140px", height: "38px" }}
          onClick={() => onDelete(selectedItem)}
          disabled={isAdding}
        >
          {isAdding ? (
            <div className="d-flex align-items-center justify-content-center">
              <PulseLoader color="white" size={10} />
            </div>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default IngredientDeleteModal;
