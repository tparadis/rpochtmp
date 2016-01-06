require 'rho/rhocontroller'
require 'helpers/browser_helper'

class SousCategoriesController < Rho::RhoController
  include BrowserHelper

  # GET /SousCategories
  def index
    @souscategories = SousCategories.find(:all)
    render :back => '/app'
  end

  # GET /SousCategories/{1}
  def show
    @souscategories = SousCategories.find(@params['id'])
    if @souscategories
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /SousCategories/new
  def new
    @souscategories = SousCategories.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /SousCategories/{1}/edit
  def edit
    @souscategories = SousCategories.find(@params['id'])
    if @souscategories
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /SousCategories/create
  def create
    @souscategories = SousCategories.create(@params['souscategories'])
    redirect :action => :index
  end

  # POST /SousCategories/{1}/update
  def update
    @souscategories = SousCategories.find(@params['id'])
    @souscategories.update_attributes(@params['souscategories']) if @souscategories
    redirect :action => :index
  end

  # POST /SousCategories/{1}/delete
  def delete
    @souscategories = SousCategories.find(@params['id'])
    @souscategories.destroy if @souscategories
    redirect :action => :index  
  end
end
