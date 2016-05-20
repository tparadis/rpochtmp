require 'rho/rhocontroller'
require 'helpers/browser_helper'

class PersonaliseeController < Rho::RhoController
  include BrowserHelper

  
  
  # GET /Personalisee
  def index
    @personalisees = Personalisee.find(:all)
    render :back => '/app'
  end

  # GET /Personalisee/{1}
  def show
    @personalisee = Personalisee.find(@params['id'])
    if @personalisee
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /Personalisee/new
  def new
    @personalisee = Personalisee.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /Personalisee/{1}/edit
  def edit
    @personalisee = Personalisee.find(@params['id'])
    if @personalisee
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /Personalisee/create
  def create
    @personalisee = Personalisee.create(@params['personalisee'])
    redirect :action => :index
  end

  # POST /Personalisee/{1}/update
  def update
    @personalisee = Personalisee.find(@params['id'])
    @personalisee.update_attributes(@params['personalisee']) if @personalisee
    redirect :action => :index
  end

  # POST /Personalisee/{1}/delete
  def delete
    @personalisee = Personalisee.find(@params['id'])
    @personalisee.destroy if @personalisee
    redirect :action => :index  
  end

    
  def get_callback
       $parcours_perso = @params['parcours_perso']
       $typeparcours = 'null'
       Rho::WebView.navigate(url_for(:action => :personalisee))
   end

  #Requete test
    def requette_etudiant
      $typeparcours = @params['type_parcours']
      Rho::WebView.navigate(url_for(:action => :personalisee))
    end
    
    def personalisee
      render :action => :personalisee, :back => 'callback:' + url_for(:action => :callback_alert)
    end
    
    def callback_alert
      Rho::WebView.executeJavaScript("backButton()")
      return false
    end
     
end
