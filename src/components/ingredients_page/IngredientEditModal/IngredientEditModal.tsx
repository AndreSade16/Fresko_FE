import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { apiFetch } from "../../../tools/fetchHelper";
import type {
  IngredientDefinitionPageContent,
  StandardError,
} from "../../../interfaces/interfaces";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../redux/store";
import { fetchIngredients } from "../../../redux/reducers/IngredientDefinitionSlice";
import { useSearchParams } from "react-router";

interface EditIngredientModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
  selectedItem: IngredientDefinitionPageContent | null;
}

const CATEGORIES = [
  "FRUIT",
  "VEGETABLE",
  "MEAT",
  "FISH",
  "DAIRY",
  "GRAIN",
  "LEGUME",
  "BAKED",
  "OTHER",
];

const UNITS = ["GRAMS", "MILLILITERS", "UNITS"];

const STORAGE_LOCATIONS = [
  { value: "PANTRY", label: "PANTRY" },
  { value: "REFRIGERATOR", label: "FRIDGE" },
];

const SEASONS = ["SPRING", "SUMMER", "AUTUMN", "WINTER"];

function IngredientEditModal({
  show,
  onHide,
  onSuccess,
  selectedItem,
}: EditIngredientModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState(selectedItem ? selectedItem?.name : "");
  const [description, setDescription] = useState(
    selectedItem ? selectedItem?.description : "",
  );
  const [category, setCategory] = useState(
    selectedItem ? selectedItem?.category : "",
  );
  const [unit, setUnit] = useState(selectedItem ? selectedItem?.unit : "");
  const [defaultStorageLocation, setDefaultStorageLocation] = useState(
    selectedItem ? selectedItem?.defaultStorageLocation : "",
  );
  const [shelfLifeDays, setShelfLifeDays] = useState<number | "">(
    selectedItem ? selectedItem?.shelfLifeDays : "",
  );
  const [alternativeUsages, setAlternativeUsages] = useState(
    selectedItem ? selectedItem?.alternativeUsages : "",
  );
  const [seasonality, setSeasonality] = useState<string[]>(
    selectedItem ? selectedItem?.seasonality : [],
  );
  const [ingredientImage, setIngredientImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSeasonChange = (season: string) => {
    setSeasonality((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season],
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setUnit("");
    setDefaultStorageLocation("");
    setShelfLifeDays("");
    setAlternativeUsages("");
    setSeasonality([]);
    setIngredientImage(null);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Ingredient name can't be blank";
    } else if (name.trim().length < 3) {
      newErrors.name = "Ingredient name must be at least 3 characters long";
    }

    if (!description.trim()) {
      newErrors.description = "Ingredient description can't be blank";
    } else if (description.trim().length < 10) {
      newErrors.description =
        "Ingredient description must be at least 10 characters long";
    }

    if (!category) {
      newErrors.category = "Category field must be filled.";
    }

    if (!unit) {
      newErrors.unit = "Unit type field must be filled.";
    }

    if (!defaultStorageLocation) {
      newErrors.defaultStorageLocation =
        "Default storage location field must be filled.";
    }

    if (shelfLifeDays === "" || Number(shelfLifeDays) <= 0) {
      newErrors.shelfLifeDays = "Shelf life days must be a positive number";
    }

    if (seasonality.length === 0) {
      newErrors.seasonality = "Seasonality set can't be empty";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("unit", unit);
      formData.append("defaultStorageLocation", defaultStorageLocation);
      formData.append("shelfLifeDays", String(shelfLifeDays));
      formData.append("alternativeUsages", alternativeUsages);

      seasonality.forEach((season) => {
        formData.append("seasonality", season);
      });

      if (ingredientImage) {
        formData.append("ingredientImage", ingredientImage);
      }

      await apiFetch(`/ingredients/${selectedItem?.ingredientDefinitionId}`, {
        method: "PUT",
        body: formData,
      });

      toast.success(`${name} successfully edited!`);
      resetForm();
      onHide();
      dispatch(fetchIngredients(searchParams));
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const standardErr = err as StandardError;
      const errorMessage =
        standardErr?.message || "An unexpected error occurred.";
      const backendErrors: Record<string, string> = {};

      try {
        const parsedError = JSON.parse(errorMessage);
        if (parsedError && Array.isArray(parsedError.errors)) {
          parsedError.errors.forEach((eStr: string) => {
            const lowerErr = eStr.toLowerCase();
            if (lowerErr.includes("name")) backendErrors.name = eStr;
            if (lowerErr.includes("description"))
              backendErrors.description = eStr;
            if (lowerErr.includes("category")) backendErrors.category = eStr;
            if (lowerErr.includes("unit")) backendErrors.unit = eStr;
            if (lowerErr.includes("storage"))
              backendErrors.defaultStorageLocation = eStr;
            if (lowerErr.includes("shelf")) backendErrors.shelfLifeDays = eStr;
            if (lowerErr.includes("season")) backendErrors.seasonality = eStr;
          });
        }
      } catch (parseErr) {
        console.error("Failed to parse JSON error response:", parseErr);
      }

      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        setErrors({ global: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      contentClassName="bg-primary"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>
          Edit {selectedItem ? selectedItem.name : "Ingredient"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <Row className="mb-3">
            <small className="mb-3 mt-2">
              *Every recipe or pantry containing{" "}
              {selectedItem ? selectedItem.name : "Ingredient"} will be modified
              as well
            </small>
            <Form.Group
              as={Col}
              md="6"
              controlId="ingredientName"
              className="mb-2"
            >
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="ingredientCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                isInvalid={!!errors.category}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.category}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="ingredientDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isInvalid={!!errors.description}
              placeholder="Brief description..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              controlId="ingredientUnit"
              className="mb-2"
            >
              <Form.Label>Unit</Form.Label>
              <Form.Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                isInvalid={!!errors.unit}
              >
                <option value="">Select Unit</option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.unit}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              as={Col}
              md="4"
              controlId="ingredientStorage"
              className="mb-2"
            >
              <Form.Label className="text-nowrap">Storage Location</Form.Label>
              <Form.Select
                value={defaultStorageLocation}
                onChange={(e) => setDefaultStorageLocation(e.target.value)}
                isInvalid={!!errors.defaultStorageLocation}
              >
                <option value="">Select Storage</option>
                {STORAGE_LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.defaultStorageLocation}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="ingredientShelfLife">
              <Form.Label>Shelf Life (Days)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={shelfLifeDays}
                onChange={(e) =>
                  setShelfLifeDays(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                isInvalid={!!errors.shelfLifeDays}
              />
              <Form.Control.Feedback type="invalid">
                {errors.shelfLifeDays}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="ingredientAlternativeUsages">
            <Form.Label>Alternative Usages (Optional)</Form.Label>
            <Form.Control
              type="text"
              value={alternativeUsages}
              onChange={(e) => setAlternativeUsages(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="ingredientSeasonality">
            <Form.Label>Seasonality</Form.Label>
            <div>
              {SEASONS.map((season) => (
                <Form.Check
                  inline
                  key={season}
                  type="checkbox"
                  id={`season-${season}`}
                  label={season}
                  checked={seasonality.includes(season)}
                  onChange={() => handleSeasonChange(season)}
                  isInvalid={!!errors.seasonality}
                />
              ))}
            </div>
            {errors.seasonality && (
              <div className="text-danger small mt-1">{errors.seasonality}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="ingredientImage">
            <Form.Label>Ingredient Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setIngredientImage(e.target.files[0]);
                }
              }}
              isInvalid={!!errors.ingredientImage}
            />
            <Form.Control.Feedback type="invalid">
              {errors.ingredientImage}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-light"
            onClick={onHide}
            disabled={isSubmitting}
            className="fw-semibold"
          >
            Cancel
          </Button>
          <Button
            variant="outline-warning"
            type="submit"
            disabled={isSubmitting}
            className="fw-semibold"
          >
            {isSubmitting ? "Saving..." : "Save Ingredient"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default IngredientEditModal;
