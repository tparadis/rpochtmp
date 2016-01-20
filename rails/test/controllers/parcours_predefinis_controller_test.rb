require 'test_helper'

class ParcoursPredefinisControllerTest < ActionController::TestCase
  setup do
    @parcours_predefini = parcours_predefinis(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:parcours_predefinis)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create parcours_predefini" do
    assert_difference('ParcoursPredefini.count') do
      post :create, parcours_predefini: { commerces: @parcours_predefini.commerces, description: @parcours_predefini.description, image: @parcours_predefini.image, name: @parcours_predefini.name }
    end

    assert_redirected_to parcours_predefini_path(assigns(:parcours_predefini))
  end

  test "should show parcours_predefini" do
    get :show, id: @parcours_predefini
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @parcours_predefini
    assert_response :success
  end

  test "should update parcours_predefini" do
    patch :update, id: @parcours_predefini, parcours_predefini: { commerces: @parcours_predefini.commerces, description: @parcours_predefini.description, image: @parcours_predefini.image, name: @parcours_predefini.name }
    assert_redirected_to parcours_predefini_path(assigns(:parcours_predefini))
  end

  test "should destroy parcours_predefini" do
    assert_difference('ParcoursPredefini.count', -1) do
      delete :destroy, id: @parcours_predefini
    end

    assert_redirected_to parcours_predefinis_path
  end
end
