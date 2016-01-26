require 'rho/rhocontroller'
require 'helpers/browser_helper'

class ParcoursPredefController < Rho::RhoController
  include BrowserHelper

  # GET /ParcoursPredef
  def index
    @parcourspredefs = ParcoursPredef.find(:all)
    render :back => '/app'
  end

  # GET /ParcoursPredef/{1}
  def show
    @parcourspredef= ParcoursPredef.find(@params['id'])
    if @parcourspredef
      render :action => :show, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # GET /ParcoursPredef/new
  def new
    @parcourspredef = ParcoursPredef.new
    render :action => :new, :back => url_for(:action => :index)
  end

  # GET /ParcoursPredef/{1}/edit
  def edit
    @parcourspredef = ParcoursPredef.find(@params['id'])
    if @parcourspredef
      render :action => :edit, :back => url_for(:action => :index)
    else
      redirect :action => :index
    end
  end

  # POST /ParcoursPredef/create
  def create
    @parcourspredef = ParcoursPredef.create(@params['parcourspredef'])
    redirect :action => :index
  end

  # POST /ParcoursPredef/{1}/update
  def update
    @parcourspredef = ParcoursPredef.find(@params['id'])
    @parcourspredef.update_attributes(@params['parcourspredef']) if @parcourspredef
    redirect :action => :index
  end

  # POST /ParcoursPredef/{1}/delete
  def delete
    @parcourspredef = ParcoursPredef.find(@params['id'])
    @parcourspredef.destroy if @parcourspredef
    redirect :action => :index  
  end
  
  #Requete test
  def requette_etudiant
    if Rho::Network.hasNetwork
      #Perform an HTTP GET request.
            getProps = Hash.new
            getProps['url'] = "http://rpoch.istic.univ-rennes1.fr/api/?req=predef&format=jsson&nom=etudiant"
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
       Rho::WebView.navigate(url_for(:action => :parcours_etudiant))
         
     else
       show_popup("GET request Failed")
     end
   end

 

  def get_resposnse
    array = Rho::JSON.parse(@@get_result)
    @@controlerarray = array
    array
  end
  
  
  def get_magasin_coord
    array = Rho::JSON.parse(@@get_result)
    id_mag = @params['magasin_number']
    $testn1=id_mag
    id_mag=Integer(id_mag)
    $magasinlng = @@controlerarray ["magasins"][id_mag]["location_lng"]
    $magasinlat = @@controlerarray ["magasins"][id_mag]["location_lat"]
    $magasin_name = @@controlerarray ["magasins"][id_mag]["enseigne"]

    $testn2=id_mag
   end
  
end
