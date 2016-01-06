require 'rho/rhocontroller'
require 'helpers/browser_helper'

class CategoriesController < Rho::RhoController
  include BrowserHelper

  def categories 
      # Get and show the various app folders
      @app_folder = Rho::Application.appBundleFolder
      @apps_bundle_folder = Rho::Application.appsBundleFolder
      @database_blob_folder = Rho::Application.databaseBlobFolder
      @public_folder = Rho::Application.publicFolder
      @user_folder = Rho::Application.userFolder
    end
  
  # GET /Categories
  # GET /Categories
  def index
    @categories = Categories.find(:all)
    render :back => '/app'
  end

  # List all objects
  # GET /Categories/{1}
  def show
    @categories = Categories.find(@params['id'])
    if @categories
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # Displays the editing form for creating a new object
  # GET /Categories/new
  def new
    @categories = Categories.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # Edits an existing object
  # GET /Categories/{1}/edit
  def edit
    @categories = Categories.find(@params['id'])
    if @categories
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # Actually creates the object.
  # POST /Categories/create
  def create
    @categories = Categories.create(@params['categories'])
    redirect :action => :index
  end

  # Updates properties of the object
  # POST /Categories/{1}/update
  def update
    @categories = Categories.find(@params['id'])
    @categories.update_attributes(@params['categories']) if @categories
    redirect :action => :index
  end

  # Deletes the object
  # POST /Categories/{1}/delete
  def delete
    @categories = Categories.find(@params['id'])
    @categories.destroy if @categories
    redirect :action => :index  
  end

  def listemagasins
    redirect :controller => :FinalParcours,:action => :listemagasins, :query => {:magasin1=> 'Creperie', :magasin2 => 'Boulangerie',:magasin3 => 'Patisserie',:magasin4=> 'Banque',:magasin5=> 'Floriste'}
  end  
end
