import { Container } from "react-bootstrap";
import PantrySection from "./PantrySection/PantrySection";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";
import { fetchDashboard } from "../../redux/reducers/DashboardSlice";
import ListSection from "./ListSection/ListSection";

function HomePage() {
  const { expiringItems, activeShoppingList, suggestedRecipes } = useSelector(
    (state: RootState) => state.dashboard,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <Container fluid className="p-3 p-md-5">
      <PantrySection expiringItems={expiringItems} />
      <ListSection activeShoppingList={activeShoppingList} />
    </Container>
  );
}

export default HomePage;
