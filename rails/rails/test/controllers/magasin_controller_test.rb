require 'test_helper'

class MagasinControllerTest < ActionController::TestCase
  test "should get magasins" do
    get :magasins
    assert_response :success
  end

end
