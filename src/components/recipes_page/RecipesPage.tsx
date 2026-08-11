import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GridLoader } from "react-spinners";
import type { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { fetchRecipes } from "../../redux/reducers/RecipesSlice";
import RecipeFilters from "./RecipeFilters/RecipeFilters";
import RecipesList from "./RecipesList/RecipesList";
import { apiFetch } from "../../tools/fetchHelper";
import {
  type RecipeIngredientsToSlDTO,
  type RecipePageContent,
  type StandardError,
} from "../../interfaces/interfaces";
import { toast } from "react-toastify";
import RecipeToSlAddModal from "./RecipeToSlModal/RecipeToSlModal";

function RecipesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<RecipePageContent | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.recipes,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoadMore = (nextPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", nextPage.toString());

    dispatch(fetchRecipes(newParams));
  };

  const hasInitialData = Boolean(
    data && data.content && data.content.length > 0,
  );

  useEffect(() => {
    const fetchRecipesList = (params: URLSearchParams) => {
      dispatch(fetchRecipes(params));
    };

    const timer = setTimeout(() => {
      fetchRecipesList(searchParams);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, dispatch]);

  const handleAddIngredients = async (
    recipe: RecipePageContent,
    numOfPeople: string,
  ) => {
    setIsAdding(true);

    try {
      const response = await apiFetch<RecipeIngredientsToSlDTO>(
        `/recipes/${recipe.recipeId}/${numOfPeople}`,
        {
          method: "POST",
        },
      );

      if (response.shoppingListItems.length > 0) {
        toast.success("Recipe ingredients are now in your shopping list!");
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

  return (
    <Container fluid className="d-flex flex-column align-items-center">
      <h1 className="fst-italic my-5 text-left w-100 ps-2 fw-bolder">
        Recipes
      </h1>
      <RecipeFilters />

      {isLoading && !hasInitialData ? (
        <GridLoader color="white" className="mt-5 pt-2" />
      ) : (
        <RecipesList
          data={data}
          isLoading={isLoading}
          error={error || errorMessage}
          onLoadMore={handleLoadMore}
          onAddIngredients={setShowAddModal}
          isAdding={isAdding}
          setSelectedItem={setSelectedItem}
        />
      )}

      <RecipeToSlAddModal
        selectedItem={selectedItem}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        onConfirmAdd={handleAddIngredients}
        isAdding={isAdding}
      />
      {/* <PantryItemCreationForm
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onSuccess={() => setShowCreateModal(false)}
      />
      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedItem={selectedItem}
        onUpdateItem={handleUpdate}
      />
      <DeleteModal
        selectedItem={selectedItem}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        onConfirmDelete={handleDelete}
      />
   */}
    </Container>
  );
}

export default RecipesPage;
