require 'test_helper'

class ResultatsControllerTest < ActionController::TestCase
  setup do
    @resultat = resultats(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:resultats)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create resultat" do
    assert_difference('Resultat.count') do
      post :create, resultat: { magasin: @resultat.magasin, message: @resultat.message, type: @resultat.type }
    end

    assert_redirected_to resultat_path(assigns(:resultat))
  end

  test "should show resultat" do
    get :show, id: @resultat
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @resultat
    assert_response :success
  end

  test "should update resultat" do
    patch :update, id: @resultat, resultat: { magasin: @resultat.magasin, message: @resultat.message, type: @resultat.type }
    assert_redirected_to resultat_path(assigns(:resultat))
  end

  test "should destroy resultat" do
    assert_difference('Resultat.count', -1) do
      delete :destroy, id: @resultat
    end

    assert_redirected_to resultats_path
  end
end
