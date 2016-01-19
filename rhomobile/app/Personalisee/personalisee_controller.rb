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
  
  #Requete test
  def requette
    if Rho::Network.hasNetwork
      #Perform an HTTP GET request.
            getProps = Hash.new
            getProps['url'] = "http://148.60.11.234/api/?req=path&format=json&nombreMagasins=21"
            #getProps['url'] = "https://rpoch.istic.univ-rennes1.fr/api/?req=path&format=json&nombreMagasins=5"
            getProps['headers'] = {"Content-Type" => "application/json"}
            Rho::Network.get(getProps, url_for(:action => :get_callback))
    else
          show_popup("Reseau pas disponible")
         end
  end
  
  def show_popup(message)
      Rho::Notification.showPopup({
        :title => "Rennes en poche",
        :message => message,
        :buttons => ["OK"]
      })
    end
    
  def get_callback
     if @params['status'] == "ok"
       @@get_result = @params['body']
       Rho::WebView.navigate(url_for(:action => :show_result))
         
     else
       show_popup("GET request Failed")
     end
   end

 

  def get_resposnse
    array = Rho::JSON.parse(@@get_result)
    commerces = array["commerces"]
    $long = commerces.collect{|x| x["vp_ne_lng"]}
    $lat = commerces.collect{|x| x["vp_ne_lng"]}
    array
  end
     
end
