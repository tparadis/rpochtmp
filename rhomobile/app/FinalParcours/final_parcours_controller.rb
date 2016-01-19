require 'rho/rhocontroller'
require 'helpers/browser_helper'

class FinalParcoursController < Rho::RhoController
  include BrowserHelper

  # GET /FinalParcours
  def index
    @finalparcours = FinalParcours.find(:all)
    render :back => '/app'
  end

  # GET /FinalParcours/{1}
  def show
    @finalparcours = FinalParcours.find(@params['id'])
    if @finalparcours
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /FinalParcours/new
  def new
    @finalparcours = FinalParcours.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /FinalParcours/{1}/edit
  def edit
    @finalparcours = FinalParcours.find(@params['id'])
    if @finalparcours
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /FinalParcours/create
  def create
    @finalparcours = FinalParcours.create(@params['finalparcours'])
    redirect :action => :index
  end

  # POST /FinalParcours/{1}/update
  def update
    @finalparcours = FinalParcours.find(@params['id'])
    @finalparcours.update_attributes(@params['finalparcours']) if @finalparcours
    redirect :action => :index
  end

  # POST /FinalParcours/{1}/delete
  def delete
    @finalparcours = FinalParcours.find(@params['id'])
    @finalparcours.destroy if @finalparcours
    redirect :action => :index  
  end
  
end
