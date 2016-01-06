require 'rho/rhocontroller'
require 'helpers/browser_helper'

class DetailsCommerceController < Rho::RhoController
  include BrowserHelper

  # GET /DetailsCommerce
  def index
    @detailscommerces = DetailsCommerce.find(:all)
    render :back => '/app'
  end

  # GET /DetailsCommerce/{1}
  def show
    @detailscommerce = DetailsCommerce.find(@params['id'])
    if @detailscommerce
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /DetailsCommerce/new
  def new
    @detailscommerce = DetailsCommerce.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /DetailsCommerce/{1}/edit
  def edit
    @detailscommerce = DetailsCommerce.find(@params['id'])
    if @detailscommerce
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /DetailsCommerce/create
  def create
    @detailscommerce = DetailsCommerce.create(@params['detailscommerce'])
    redirect :action => :index
  end

  # POST /DetailsCommerce/{1}/update
  def update
    @detailscommerce = DetailsCommerce.find(@params['id'])
    @detailscommerce.update_attributes(@params['detailscommerce']) if @detailscommerce
    redirect :action => :index
  end

  # POST /DetailsCommerce/{1}/delete
  def delete
    @detailscommerce = DetailsCommerce.find(@params['id'])
    @detailscommerce.destroy if @detailscommerce
    redirect :action => :index  
  end
end
