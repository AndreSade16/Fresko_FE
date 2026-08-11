import React from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router";

export type RecipeDifficulty = "VERY_EASY" | "EASY" | "MEDIUM" | "HARD";
export type RecipeCost = "CHEAP" | "NORMAL" | "EXPENSIVE";

interface RecipeFiltersProps {
  applyFilters?: (newParams: URLSearchParams) => void;
}

function RecipeFilters({ applyFilters }: RecipeFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    name: searchParams.get("name") || "",
    minTime: searchParams.get("minTime") || "",
    maxTime: searchParams.get("maxTime") || "",
    difficulty: searchParams.getAll("difficulty"),
    cost: searchParams.getAll("cost"),
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const handleFilterChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }

    setSearchParams(newParams);
  };

  const handleCheckboxChange = (
    paramName: string,
    value: string,
    isChecked: boolean,
  ) => {
    const newParams = new URLSearchParams(searchParams);
    const currentValues = newParams
      .getAll(paramName)
      .filter((val) => val !== value);

    newParams.delete(paramName);

    const updatedValues = isChecked ? [...currentValues, value] : currentValues;

    updatedValues.forEach((val) => newParams.append(paramName, val));

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const emptyParams = new URLSearchParams();
    setSearchParams(emptyParams);
    if (applyFilters) applyFilters(emptyParams);
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (applyFilters) applyFilters(searchParams);
  };

  return (
    <Accordion className="mb-4 w-75 mx-auto">
      <Accordion.Item
        eventKey="0"
        className="bg-dark text-light border-0 rounded-3 overflow-hidden"
      >
        <Accordion.Header className="bg-light">
          <span className="fw-bold text-dark">🔍 Recipe Filters & Search</span>
        </Accordion.Header>
        <Accordion.Body className="bg-dark text-light">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Name */}
              <Col xs={12} md={4}>
                <Form.Group controlId="filterRecipeName">
                  <Form.Label className="small text-muted mb-1">
                    Recipe Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Search recipe..."
                    value={filters.name}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              {/* Min Time */}
              <Col xs={6} md={2}>
                <Form.Group controlId="filterMinTime">
                  <Form.Label className="small text-muted mb-1">
                    Min Time (min)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    name="minTime"
                    placeholder="0"
                    value={filters.minTime}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              {/* Max Time */}
              <Col xs={6} md={2}>
                <Form.Group controlId="filterMaxTime">
                  <Form.Label className="small text-muted mb-1">
                    Max Time (min)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    name="maxTime"
                    placeholder="120"
                    value={filters.maxTime}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              {/* Difficulty */}
              <Col xs={12} md={2}>
                <Form.Label className="small text-muted mb-1 d-block">
                  Difficulty
                </Form.Label>
                <div className="d-flex flex-column gap-1">
                  {[
                    { label: "Very Easy", value: "VERY_EASY" },
                    { label: "Easy", value: "EASY" },
                    { label: "Medium", value: "MEDIUM" },
                    { label: "Hard", value: "HARD" },
                  ].map((item) => (
                    <Form.Check
                      key={item.value}
                      type="checkbox"
                      id={`diff-${item.value}`}
                      label={item.label}
                      className="small"
                      checked={filters.difficulty.includes(item.value)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "difficulty",
                          item.value,
                          e.target.checked,
                        )
                      }
                    />
                  ))}
                </div>
              </Col>

              {/* Cost */}
              <Col xs={12} md={2}>
                <Form.Label className="small text-muted mb-1 d-block">
                  Cost
                </Form.Label>
                <div className="d-flex flex-column gap-1">
                  {[
                    { label: "Cheap", value: "CHEAP" },
                    { label: "Normal", value: "NORMAL" },
                    { label: "Expensive", value: "EXPENSIVE" },
                  ].map((item) => (
                    <Form.Check
                      key={item.value}
                      type="checkbox"
                      id={`cost-${item.value}`}
                      label={item.label}
                      className="small"
                      checked={filters.cost.includes(item.value)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "cost",
                          item.value,
                          e.target.checked,
                        )
                      }
                    />
                  ))}
                </div>
              </Col>

              {/* Sort By */}
              <Col xs={12} md={6}>
                <Form.Group controlId="filterSortBy">
                  <Form.Label className="small text-muted mb-1">
                    Sort By
                  </Form.Label>
                  <Form.Select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">None</option>
                    <option value="name">Name</option>
                    <option value="visitsCount">Most Visited</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Direction */}
              <Col xs={12} md={6}>
                <Form.Group controlId="filterSortDirection">
                  <Form.Label className="small text-muted mb-1">
                    Direction
                  </Form.Label>
                  <Form.Select
                    name="direction"
                    value={filters.direction}
                    onChange={handleFilterChange}
                    size="sm"
                    disabled={!filters.sortBy}
                  >
                    <option value="">
                      {!filters.sortBy ? "Select sort by first" : "Direction"}
                    </option>
                    <option value="ASC">Ascending (ASC)</option>
                    <option value="DESC">Descending (DESC)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="light"
                size="sm"
                className="fw-semibold"
              >
                Apply Filters
              </Button>
            </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default RecipeFilters;
