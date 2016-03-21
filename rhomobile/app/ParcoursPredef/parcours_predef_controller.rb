require 'rho/rhocontroller'
require 'helpers/browser_helper'

class ParcoursPredefController < Rho::RhoController
  include BrowserHelper

  # GET /ParcoursPredef
  def index
    @parcourspredefs = ParcoursPredef.find(:all)
    render :back => '/app'
  end

  # GET /ParcoursPredef/{1}
  def show
    @parcourspredef= ParcoursPredef.find(@params['id'])
    if @parcourspredef
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /ParcoursPredef/new
  def new
    @parcourspredef = ParcoursPredef.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /ParcoursPredef/{1}/edit
  def edit
    @parcourspredef = ParcoursPredef.find(@params['id'])
    if @parcourspredef
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /ParcoursPredef/create
  def create
    @parcourspredef = ParcoursPredef.create(@params['parcourspredef'])
    redirect :action => :index
  end

  # POST /ParcoursPredef/{1}/update
  def update
    @parcourspredef = ParcoursPredef.find(@params['id'])
    @parcourspredef.update_attributes(@params['parcourspredef']) if @parcourspredef
    redirect :action => :index
  end

  # POST /ParcoursPredef/{1}/delete
  def delete
    @parcourspredef = ParcoursPredef.find(@params['id'])
    @parcourspredef.destroy if @parcourspredef
    redirect :action => :index  
  end
  
  #Requete test
  def requette_etudiant
    $typeparcours = @params['type_parcours']
    Rho::WebView.navigate(url_for(:action => :parcours_predef_carte))
  end
  
end
