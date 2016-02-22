require 'rho/rhocontroller'
require 'helpers/browser_helper'

class DescriptionController < Rho::RhoController
  include BrowserHelper

  # GET /Description
  def index
    @descriptions = Description.find(:all)
    render :back => '/app'
  end

  # GET /Description/{1}
  def show
    @description = Description.find(@params['id'])
    if @description
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /Description/new
  def new
    @description = Description.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /Description/{1}/edit
  def edit
    @description = Description.find(@params['id'])
    if @description
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /Description/create
  def create
    @description = Description.create(@params['description'])
    redirect :action => :index
  end

  # POST /Description/{1}/update
  def update
    @description = Description.find(@params['id'])
    @description.update_attributes(@params['description']) if @description
    redirect :action => :index
  end

  # POST /Description/{1}/delete
  def delete
    @description = Description.find(@params['id'])
    @description.destroy if @description
    redirect :action => :index  
  end
  
  def requette_description
    $typeparcours = @params['type_parcours']
    redirect :action => :description
  end
  
end
