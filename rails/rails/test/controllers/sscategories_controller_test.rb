require 'test_helper'

class SscategoriesControllerTest < ActionController::TestCase
  setup do
    @sscategory = sscategories(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:sscategories)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create sscategory" do
    assert_difference('Sscategory.count') do
      post :create, sscategory: { catparent: @sscategory.catparent, nom: @sscategory.nom }
    end

    assert_redirected_to sscategory_path(assigns(:sscategory))
  end

  test "should show sscategory" do
    get :show, id: @sscategory
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @sscategory
    assert_response :success
  end

  test "should update sscategory" do
    patch :update, id: @sscategory, sscategory: { catparent: @sscategory.catparent, nom: @sscategory.nom }
    assert_redirected_to sscategory_path(assigns(:sscategory))
  end

  test "should destroy sscategory" do
    assert_difference('Sscategory.count', -1) do
      delete :destroy, id: @sscategory
    end

    assert_redirected_to sscategories_path
  end
end
