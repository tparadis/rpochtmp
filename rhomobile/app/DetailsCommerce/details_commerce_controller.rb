require 'rho/rhocontroller'
require 'helpers/browser_helper'

class DetailsCommerceController < Rho::RhoController
  include BrowserHelper
  #requette should be like this
  #<a href="<%= url_for :controller => :DetailsCommerce  , :action => :requette , :query => {:magasin_id => '002e4fae-28a8-463f-b064-cfff1f75635b'}  %>">
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
  
  #Cette requette recoit comme input l'dentificateur du commerce dans la basse de données. 
    def requette
      $magasin_id = @params['magasin_id']
      if Rho::Network.hasNetwork
        #Perform an HTTP GET request.
        
              getProps = Hash.new
              getProps['url'] = "http://148.60.11.234/api/?req=spec&format=json&id="+@params['magasin_id']
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
         Rho::WebView.navigate(url_for(:action => :details_commerce))
       else
         show_popup("GET request Failed")
       end
     end
  
   
  
    def get_resposnse
      array = Rho::JSON.parse(@@get_result)
      array["commerce"]["image"]= "http://148.60.11.234/static/images/" +array["commerce"]["image"]
      array["commerce"]["description"] = "Alors là, grosse loose : moi qui habite dans le très animé quartier Saint-Hélier, je n’avais encore jamais passé le pas de porte des Sucrés-Salés.\n      
      Boutique phare du bout de la rue, je pensais jusqu’à lors que l’enseigne ne proposait que du thé. Et moi le thé, je n’aime pas ça.\n       
      Et bien j’ai eu tort de résumer cette jolie épicerie aux petits sachets de plantes à infuser même si les amateurs de la boisson la plus consommée au monde vont adorer, mais on y trouve un tas de jolies choses comme…"
      array
    end
  
    
end
