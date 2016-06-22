require 'test_helper'

class PhoneidsControllerTest < ActionController::TestCase
  setup do
    @phoneid = phoneids(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:phoneids)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create phoneid" do
    assert_difference('Phoneid.count') do
      post :create, phoneid: { info: @phoneid.info }
    end

    assert_redirected_to phoneid_path(assigns(:phoneid))
  end

  test "should show phoneid" do
    get :show, id: @phoneid
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @phoneid
    assert_response :success
  end

  test "should update phoneid" do
    patch :update, id: @phoneid, phoneid: { info: @phoneid.info }
    assert_redirected_to phoneid_path(assigns(:phoneid))
  end

  test "should destroy phoneid" do
    assert_difference('Phoneid.count', -1) do
      delete :destroy, id: @phoneid
    end

    assert_redirected_to phoneids_path
  end
end
