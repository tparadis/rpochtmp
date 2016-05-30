require 'test_helper'

class CategoriesControllersControllerTest < ActionController::TestCase
  setup do
    @categories_controller = categories_controllers(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:categories_controllers)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create categories_controller" do
    assert_difference('CategoriesController.count') do
      post :create, categories_controller: {  }
    end

    assert_redirected_to categories_controller_path(assigns(:categories_controller))
  end

  test "should show categories_controller" do
    get :show, id: @categories_controller
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @categories_controller
    assert_response :success
  end

  test "should update categories_controller" do
    patch :update, id: @categories_controller, categories_controller: {  }
    assert_redirected_to categories_controller_path(assigns(:categories_controller))
  end

  test "should destroy categories_controller" do
    assert_difference('CategoriesController.count', -1) do
      delete :destroy, id: @categories_controller
    end

    assert_redirected_to categories_controllers_path
  end
end
