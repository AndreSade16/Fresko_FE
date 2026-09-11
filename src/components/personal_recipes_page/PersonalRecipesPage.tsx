import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { apiFetch } from "../../tools/fetchHelper";
import {
  type RecipeIngredientsToSlDTO,
  type RecipePageContent,
  type StandardError,
} from "../../interfaces/interfaces";
import { toast } from "react-toastify";

import { createActiveShoppingList } from "../../redux/reducers/ShoppingListSlice";
import { fetchUserProfile } from "../../redux/reducers/UserSlice";
import SkeletonCard from "../skeleton_card/SkeletonCard";
import { fetchPersonalRecipes } from "../../redux/reducers/PersonalRecipesSlice";
import RecipeToSlAddModal from "../recipes_page/RecipeToSlModal/RecipeToSlModal";
import AddMissingIngredientsModal from "../recipes_page/AddMissingIngredientsModal/AddMissingIngredientsModal";
import RecipeEditModal from "../recipes_page/RecipeEditModal/RecipeEditModal";
import RecipePrepareModal from "../recipes_page/RecipePrepareModal/RecipePrepareModal";
import RecipeDeleteModal from "../recipes_page/RecipeDeleteModal/RecipeDeleteModal";
import PersonalRecipesList from "./PersonaRecipesList/PersonalRecipesList";
import LemonImage from "../LemonImage/LemonImage";

function PersonalRecipesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const pantryItems = useSelector((state: RootState) => state.user.pantryItems);

  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<RecipePageContent | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddMissingModal, setShowAddMissingModal] =
    useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showPrepareModal, setShowPrepareModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.personalRecipes,
  );
  const userRole = useSelector((state: RootState) => state.user.role);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoadMore = (nextPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", nextPage.toString());

    dispatch(fetchPersonalRecipes(newParams));
  };

  const hasInitialData = Boolean(
    data && data.content && data.content.length > 0,
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchPersonalRecipes(searchParams));
  }, [dispatch, searchParams]);

  const handleAddIngredients = async (
    recipe: RecipePageContent,
    numOfPeople: string,
  ) => {
    setIsAdding(true);

    await dispatch(createActiveShoppingList());

    try {
      const response = await apiFetch<RecipeIngredientsToSlDTO>(
        `/recipes/${recipe.recipeId}/${numOfPeople}`,
        {
          method: "POST",
        },
      );

      if (response.shoppingListItems.length > 0) {
        toast.success(
          "Recipe ingredients added to your shopping list! (complete it to insert them in your pantry)",
        );
        dispatch(fetchUserProfile());
      }
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
      setErrorMessage(message);
    } finally {
      setSelectedItem(null);
      setShowAddModal(false);
      setIsAdding(false);
    }
  };

  const handleAddMissingIngredients = async (
    recipe: RecipePageContent,
    numOfPeople: string,
  ) => {
    setIsAdding(true);
    await dispatch(createActiveShoppingList());

    try {
      const response = await apiFetch<RecipeIngredientsToSlDTO>(
        `/recipes/${recipe.recipeId}/remaining/${numOfPeople}`,
        {
          method: "POST",
        },
      );

      if (response.shoppingListItems.length > 0) {
        toast.success(
          "Missing recipe ingredients are now in your shopping list! (complete it to insert them in your pantry)",
        );
      }
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setShowAddModal(false);
      setIsAdding(false);
    }
  };

  const handleEdit = () => {};

  const handlePrepare = async (
    selectedRecipe: RecipePageContent | null,
    peopleCount: number,
  ) => {
    if (!selectedRecipe || peopleCount <= 0) return;
    setIsAdding(true);

    try {
      await apiFetch(
        `/recipes/${selectedRecipe.recipeId}?peopleCount=${peopleCount}`,
        {
          method: "POST",
        },
      );
      toast.success(`${selectedRecipe.name} successfully prepared!`);
      setShowPrepareModal(false);
      dispatch(fetchUserProfile());
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (recipe: RecipePageContent | null) => {
    if (!recipe) {
      toast.error("Recipe not found");
      return;
    }

    setIsAdding(true);
    try {
      await apiFetch(`/recipes/${recipe.recipeId}`, { method: "DELETE" });
      toast.success(`${recipe.name} deleted successfully!`);
      dispatch(fetchPersonalRecipes(searchParams));
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
      setErrorMessage(message);
    } finally {
      setSelectedItem(null);
      setShowDeleteModal(false);
      setIsAdding(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center position-relative"
    >
      <LemonImage />
      <h1 className="fst-italic my-5 text-left w-100 ps-2 fw-bolder z-1">
        Saved Recipes
      </h1>

      {isLoading && !hasInitialData ? (
        <div
          className="ingredient-list-container mt-3 w-100 d-flex justify-content-center"
          style={{ minWidth: "200px" }}
        >
          <Row xs={1} sm={2} md={3} lg={4} className="g-4 w-100">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </Row>
        </div>
      ) : (
        <PersonalRecipesList
          data={data}
          pantryItems={pantryItems}
          isLoading={isLoading}
          error={error || errorMessage}
          onLoadMore={handleLoadMore}
          onAddIngredients={setShowAddModal}
          isAdding={isAdding}
          setSelectedItem={setSelectedItem}
          userRole={userRole}
          onAddMissing={() => setShowAddMissingModal(true)}
          onPrepareItem={() => setShowPrepareModal(true)}
          onDeleteItem={() => setShowDeleteModal(true)}
          onEditItem={() => setShowEditModal(true)}
        />
      )}

      <RecipeToSlAddModal
        selectedItem={selectedItem}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        onConfirmAdd={handleAddIngredients}
        isAdding={isAdding}
      />

      <AddMissingIngredientsModal
        showAddMissingModal={showAddMissingModal}
        setShowAddMissingModal={setShowAddMissingModal}
        selectedItem={selectedItem}
        isAdding={isAdding}
        onConfirmAdd={handleAddMissingIngredients}
      />

      {selectedItem && (
        <RecipeEditModal
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          selectedItem={selectedItem}
          onEdit={handleEdit}
        />
      )}
      <RecipePrepareModal
        show={showPrepareModal}
        selectedRecipe={selectedItem}
        onHide={() => setShowPrepareModal(false)}
        onPrepare={handlePrepare}
        isAdding={isAdding || isLoading}
      />
      <RecipeDeleteModal
        selectedItem={selectedItem}
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onDelete={handleDelete}
        isAdding={isAdding}
      />
    </Container>
  );
}

export default PersonalRecipesPage;
