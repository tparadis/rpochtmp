require 'rho/rhocontroller'
require 'helpers/browser_helper'

class RechercheTagsController < Rho::RhoController
  include BrowserHelper

  # GET /@RechercheTags
  def index
    @recherchetags = @RechercheTags.find(:all)
    render :back => '/app'
  end

  # GET /@RechercheTags/{1}
  def show
    @recherchetags = @RechercheTags.find(@params['id'])
    if @recherchetags
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /@RechercheTags/new
  def new
    @recherchetags = @RechercheTags.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /@RechercheTags/{1}/edit
  def edit
    @recherchetags = @RechercheTags.find(@params['id'])
    if @recherchetags
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /@RechercheTags/create
  def create
    @recherchetags = @RechercheTags.create(@params['recherchetags'])
    redirect :action => :index
  end

  # POST /@RechercheTags/{1}/update
  def update
    @recherchetags = @RechercheTags.find(@params['id'])
    @recherchetags.update_attributes(@params['recherchetags']) if @recherchetags
    redirect :action => :index
  end

  # POST /@RechercheTags/{1}/delete
  def delete
    @recherchetags = @RechercheTags.find(@params['id'])
    @recherchetags.destroy if @recherchetags
    redirect :action => :index  
  end
  
  
end
