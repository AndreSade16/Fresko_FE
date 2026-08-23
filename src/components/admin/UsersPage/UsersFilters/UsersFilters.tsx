import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router";

interface UserFiltersProps {
  applyFilters?: (newParams: URLSearchParams) => void;
}

function UserFilters({ applyFilters }: UserFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    username: searchParams.get("username") || "",
    email: searchParams.get("email") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    role: searchParams.get("role") || "",
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
          <span className="fw-bold text-dark">🔍 Filters & Search</span>
        </Accordion.Header>
        <Accordion.Body className="bg-dark text-light">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Group controlId="filterUsername">
                  <Form.Label className="small text-muted mb-1">
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Search username..."
                    value={filters.username}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group controlId="filterEmail">
                  <Form.Label className="small text-muted mb-1">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    placeholder="Search email..."
                    value={filters.email}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group controlId="filterRole">
                  <Form.Label className="small text-muted mb-1">
                    Role
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All Roles</option>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId="filterFirstName">
                  <Form.Label className="small text-muted mb-1">
                    First Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Search first name..."
                    value={filters.firstName}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId="filterLastName">
                  <Form.Label className="small text-muted mb-1">
                    Last Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Search last name..."
                    value={filters.lastName}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

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
                    <option value="">Sort By</option>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                  </Form.Select>
                </Form.Group>
              </Col>

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
                    className={filters.sortBy ? "" : "bg-primary text-light"}
                  >
                    <option value="">
                      {filters.sortBy ? "Direction" : "Choose sorting first"}
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

export default UserFilters;
