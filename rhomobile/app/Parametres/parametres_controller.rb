require 'rho/rhocontroller'
require 'helpers/browser_helper'

class ParametresController < Rho::RhoController
  include BrowserHelper

  # GET /Parametres
  def index
    @parametres = Parametres.find(:all)
    render :back => '/app'
  end

end
