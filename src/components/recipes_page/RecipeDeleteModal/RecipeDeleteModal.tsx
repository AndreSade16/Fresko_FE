import { Button, Modal } from "react-bootstrap";
import type { RecipePageContent } from "../../../interfaces/interfaces";
import { PulseLoader } from "react-spinners";

interface RecipeDeleteModalProps {
  show: boolean;
  selectedItem: RecipePageContent | null;
  onHide: () => void;
  onDelete: (selectedItem: RecipePageContent | null) => void;
  isAdding: boolean;
}

function RecipeDeleteModal({
  show,
  selectedItem,
  onHide,
  onDelete,
  isAdding,
}: RecipeDeleteModalProps) {
  return (
    <Modal
      show={show}
      backdrop="static"
      centered
      contentClassName="bg-primary text-light"
      onHide={onHide}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Delete Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <b>{selectedItem?.name}</b>?<br />
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

export default RecipeDeleteModal;
