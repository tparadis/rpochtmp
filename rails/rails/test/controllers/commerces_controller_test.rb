require 'test_helper'

class CommercesControllerTest < ActionController::TestCase
  setup do
    @commerce = commerces(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:commerces)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create commerce" do
    assert_difference('Commerce.count') do
      post :create, commerce: {  }
    end

    assert_redirected_to commerce_path(assigns(:commerce))
  end

  test "should show commerce" do
    get :show, id: @commerce
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @commerce
    assert_response :success
  end

  test "should update commerce" do
    patch :update, id: @commerce, commerce: {  }
    assert_redirected_to commerce_path(assigns(:commerce))
  end

  test "should destroy commerce" do
    assert_difference('Commerce.count', -1) do
      delete :destroy, id: @commerce
    end

    assert_redirected_to commerces_path
  end
end
