require 'rho/rhocontroller'
require 'helpers/browser_helper'

class AccueilController < Rho::RhoController
  include BrowserHelper

  # GET /Accueil
  def index
    @accueils = Accueil.find(:all)
    render :back => '/app'
  end

  # GET /Accueil/{1}
  def show
    @accueil = Accueil.find(@params['id'])
    if @accueil
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /Accueil/new
  def new
    @accueil = Accueil.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /Accueil/{1}/edit
  def edit
    @accueil = Accueil.find(@params['id'])
    if @accueil
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /Accueil/create
  def create
    @accueil = Accueil.create(@params['accueil'])
    redirect :action => :index
  end

  # POST /Accueil/{1}/update
  def update
    @accueil = Accueil.find(@params['id'])
    @accueil.update_attributes(@params['accueil']) if @accueil
    redirect :action => :index
  end

  # POST /Accueil/{1}/delete
  def delete
    @accueil = Accueil.find(@params['id'])
    @accueil.destroy if @accueil
    redirect :action => :index  
  end
end
