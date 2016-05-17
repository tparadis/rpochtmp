require 'rho/rhocontroller'
require 'helpers/browser_helper'

class CreditController < Rho::RhoController
  include BrowserHelper

  # GET /Credit
  def index
    @credits = Credit.find(:all)
    render :back => '/app'
  end

end
