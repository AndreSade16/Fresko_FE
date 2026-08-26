import { Alert, Container } from "react-bootstrap";
import PantrySection from "./PantrySection/PantrySection";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";
import { fetchDashboard } from "../../redux/reducers/DashboardSlice";
import ListSection from "./ListSection/ListSection";
import SuggestedRecipesSection from "./SuggestedRecipesSection/SuggestedRecipesSection";
import BlurText from "../../tools/Blurtext";

function HomePage() {
  const {
    expiringItems,
    activeShoppingList,
    suggestedRecipes,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.dashboard);
  const { firstName } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <Container fluid className="p-3 p-md-5">
      {error && (
        <Alert variant="danger" className="mx-lg-4 mb-4 rounded-3 shadow-sm">
          <Alert.Heading className="fs-6 fw-bold mb-1">
            An error occurred:
          </Alert.Heading>
          {typeof error === "object" ? error.message : error}
        </Alert>
      )}
      <div className="d-flex align-items-center gap-1">
        <img src="/favicon.png" style={{ width: "100px" }} />
        <div className="d-flex flex-column">
          <h3 className="fw-semibold ps-3 mt-3">Hi {firstName}!</h3>
          <h3 className="fw-semibold ps-3">
            Here's what's{" "}
            <span className="text-secondary text-nowrap">
              <BlurText
                text="Fresko"
                delay={200}
                animateBy="letters"
                direction="top"
                className="text-2xl mb-8 d-inline"
              />
            </span>{" "}
            today
          </h3>
        </div>
      </div>
      <PantrySection expiringItems={expiringItems} isLoading={isLoading} />
      <ListSection
        activeShoppingList={activeShoppingList}
        isLoading={isLoading}
      />
      <SuggestedRecipesSection
        suggestedRecipes={suggestedRecipes}
        isLoading={isLoading}
      />
    </Container>
  );
}

export default HomePage;
