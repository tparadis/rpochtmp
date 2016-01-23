require 'rho/rhocontroller'
require 'helpers/browser_helper'

class ChercheurController < Rho::RhoController
  include BrowserHelper

  # GET /Chercheur
  def index
    @chercheurs = Chercheur.find(:all)
    render :back => '/app'
  end

  # GET /Chercheur/{1}
  def show
    @chercheur = Chercheur.find(@params['id'])
    if @chercheur
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /Chercheur/new
  def new
    @chercheur = Chercheur.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /Chercheur/{1}/edit
  def edit
    @chercheur = Chercheur.find(@params['id'])
    if @chercheur
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /Chercheur/create
  def create
    @chercheur = Chercheur.create(@params['chercheur'])
    redirect :action => :index
  end

  # POST /Chercheur/{1}/update
  def update
    @chercheur = Chercheur.find(@params['id'])
    @chercheur.update_attributes(@params['chercheur']) if @chercheur
    redirect :action => :index
  end

  # POST /Chercheur/{1}/delete
  def delete
    @chercheur = Chercheur.find(@params['id'])
    @chercheur.destroy if @chercheur
    redirect :action => :index  
  end
end
