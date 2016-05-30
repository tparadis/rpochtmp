require 'test_helper'

class MagasinsControllerTest < ActionController::TestCase
  setup do
    @magasin = magasins(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:magasins)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create magasin" do
    assert_difference('Magasin.count') do
      post :create, magasin: { latitude: @magasin.latitude, longitude: @magasin.longitude, nom: @magasin.nom }
    end

    assert_redirected_to magasin_path(assigns(:magasin))
  end

  test "should show magasin" do
    get :show, id: @magasin
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @magasin
    assert_response :success
  end

  test "should update magasin" do
    patch :update, id: @magasin, magasin: { latitude: @magasin.latitude, longitude: @magasin.longitude, nom: @magasin.nom }
    assert_redirected_to magasin_path(assigns(:magasin))
  end

  test "should destroy magasin" do
    assert_difference('Magasin.count', -1) do
      delete :destroy, id: @magasin
    end

    assert_redirected_to magasins_path
  end
end
