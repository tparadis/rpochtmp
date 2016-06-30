require 'test_helper'

class TutosControllerTest < ActionController::TestCase
  setup do
    @tuto = tutos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:tutos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create tuto" do
    assert_difference('Tuto.count') do
      post :create, tuto: { de: @tuto.de, en: @tuto.en, esp: @tuto.esp, fr: @tuto.fr, page: @tuto.page }
    end

    assert_redirected_to tuto_path(assigns(:tuto))
  end

  test "should show tuto" do
    get :show, id: @tuto
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @tuto
    assert_response :success
  end

  test "should update tuto" do
    patch :update, id: @tuto, tuto: { de: @tuto.de, en: @tuto.en, esp: @tuto.esp, fr: @tuto.fr, page: @tuto.page }
    assert_redirected_to tuto_path(assigns(:tuto))
  end

  test "should destroy tuto" do
    assert_difference('Tuto.count', -1) do
      delete :destroy, id: @tuto
    end

    assert_redirected_to tutos_path
  end
end
