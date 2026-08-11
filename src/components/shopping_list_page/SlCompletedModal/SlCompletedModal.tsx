import { Button, Modal } from "react-bootstrap";
import type { ShoppingListItem } from "../../../interfaces/interfaces";

interface SlCompletedModalProps {
  showCompleteModal: boolean;
  setShowCompleteModal: (show: boolean) => void;
  itemsOnList: ShoppingListItem[] | null;
  onComplete: () => void;
}

function SlCompletedModal({
  showCompleteModal,
  setShowCompleteModal,
  itemsOnList,
  onComplete,
}: SlCompletedModalProps) {
  return (
    <Modal
      show={showCompleteModal}
      onHide={() => setShowCompleteModal(false)}
      centered
      contentClassName="bg-primary text-light"
    >
      <Modal.Header closeButton closeVariant="white">
        {" "}
        <Modal.Title>Confirm Complete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to complete your list?</p>
        {itemsOnList?.map((item) => (
          <p key={item.shoppingListItemId} className="my-1">
            <strong>{item.ingredientDefinition.name}</strong> -{" "}
            {item.purchasedQuantity} {item.suggestedUnit.toLowerCase()}
          </p>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-light"
          onClick={() => setShowCompleteModal(false)}
        >
          Cancel
        </Button>
        <Button variant="warning" className="fw-semibold" onClick={onComplete}>
          Complete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SlCompletedModal;
