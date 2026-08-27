import { Button, Form, Modal } from "react-bootstrap";
import type { RecipePageContent } from "../../../interfaces/interfaces";
import { PulseLoader } from "react-spinners";
import { useState } from "react";

interface RecipePrepareModalProps {
  show: boolean;
  selectedRecipe: RecipePageContent | null;
  onHide: () => void;
  onPrepare: (
    selectedRecipe: RecipePageContent | null,
    peopleCount: number,
  ) => void;
  isAdding: boolean;
}

function RecipePrepareModal({
  show,
  selectedRecipe,
  onHide,
  onPrepare,
  isAdding,
}: RecipePrepareModalProps) {
  const [peopleCount, setPeopleCount] = useState<number | "">(1);

  const handleSubmit = (e: React.SubmitEvent) => {
    if (peopleCount === "") return;
    e.preventDefault();
    onPrepare(selectedRecipe, peopleCount);
  };

  return (
    <Modal
      show={show}
      backdrop="static"
      centered
      contentClassName="bg-primary text-light"
      onHide={onHide}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Prepare Recipe</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          Are you sure you want to prepare recipe <b>{selectedRecipe?.name}</b>?
          <br />
          <p className="my-2">
            <small>
              * If you have enough ingredients in your pantry, they'll be
              consumed starting from the ones nearer to expiration (as you
              should do as well 😉 )
            </small>
          </p>
          <Form.Group controlId="prepTime" className="my-3">
            <Form.Label className="fw-semibold">
              How many people are eating your {selectedRecipe?.name}?
            </Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="e.g. 15"
              value={peopleCount}
              onChange={(e) =>
                setPeopleCount(e.target.value ? Number(e.target.value) : "")
              }
              required
            />
          </Form.Group>
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
            variant="outline-warning"
            className="fw-semibold d-inline-flex align-items-center justify-content-center"
            style={{ minWidth: "140px", height: "38px" }}
            type="submit"
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="d-flex align-items-center justify-content-center">
                <PulseLoader color="white" size={10} />
              </div>
            ) : (
              "Prepare"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RecipePrepareModal;
