import { Button, Modal } from "react-bootstrap";
import { PulseLoader } from "react-spinners";

interface PwUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onUpdate: () => void;
  isUpdating: boolean;
}

function PwUpdateModal({
  show,
  setShow,
  onUpdate,
  isUpdating,
}: PwUpdateModalProps) {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      contentClassName="bg-primary text-light"
      centered
    >
      <Modal.Header>
        <Modal.Title>Password Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to change your password?</Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-light"
          onClick={() => setShow(false)}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          variant="warning"
          onClick={onUpdate}
          className="fw-semibold position-relative"
          disabled={isUpdating}
        >
          <span style={{ visibility: isUpdating ? "hidden" : "visible" }}>
            Update
          </span>

          {/* Lo spinner viene posizionato sopra al centro senza alterare il layout */}
          {isUpdating && (
            <div className="position-absolute start-50 top-50 translate-middle d-flex align-items-center">
              <PulseLoader color="#000000" size={8} />
            </div>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PwUpdateModal;
