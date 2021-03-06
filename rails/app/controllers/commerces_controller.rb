class CommercesController < ApplicationController
  
  #before_action :own_shop, only:[:edit, :update]
  before_action :current_user
  #before_action :require_admin, only: [:index, :show, :edit, :update, :destroy]
  before_action :require_admin_promo, only: [:index, :show, :edit, :update, :destroy]
	skip_before_action :verify_authenticity_token
  # GET /commerces
  # GET /commerces.json
  def index
  	require_admin()
  	@commerces = Commerce.all
	@shops = Commerce.all
  end

  # GET /commerces/1
  # GET /commerces/1.json
  def show
  	@commerce = Commerce.find(params[:id])
  end

  # GET /commerces/new
  def new
    @commerce = Commerce.new
  end

  # GET /commerces/1/edit
  def edit
  	@commerce = Commerce.find(params[:id])
  end

  # POST /commerces
  # POST /commerces.json
  def create
    @commerce = Commerce.new(commerce_params)

    respond_to do |format|
      if @commerce.save
        format.html { redirect_to @commerce, notice: 'Commerce was successfully created.' }
        format.json {head :no_content}
      else
        format.html { render :new }
        format.json { render json: @commerce.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /commerces/1
  # PATCH/PUT /commerces/1.json
  def update
    respond_to do |format|
		@commerce = Commerce.find(params[:id])
      if @commerce.update(commerce_params)
      	 	if @current_user.status == 'admin'
				format.html { redirect_to commerces_path, action: :index,  notice: 'Commerce was successfully updated.' }
				format.json {head :no_content}
			elsif @current_user.status == 'promoted'
				format.html { redirect_to user_path(@current_user.id), action: :index,  notice: 'Commerce was successfully updated.' }
			else
				require_admin()
			end
       	 	format.json { render :done }
      else
        format.html { render :edit }
        format.json { render json: @commerce.errors, status: :unprocessable_entity }
      end
    end
  end


  #Controller spécial pour la MAJ depuis JS
  def done
  end

  # DELETE /commerces/1
  # DELETE /commerces/1.json
  def destroy
  	@commerce = Commerce.find(params[:id])
    @commerce.destroy
    respond_to do |format|
      format.html { redirect_to commerces_url, notice: 'Commerce was successfully destroyed.' }
      format.json { render :done }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_commerce
      @commerce = Commerce.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def commerce_params
      #params[:commerce]
	params.require(:commerce).permit(:id, :line, :siret, :enseigne, :rasoc, :date_deb_act, :date_rad, :code_ape, :label_ape, :zone_ape, :label_zone_ape, :street_num, :sort_street_name, :city_code, :city_label, :epci2014, :phone_num, :fax_num, :email, :street_number, :route, :city, :dptmt, :region, :country, :postal_code, :location_lat, :location_lng, :location_type, :google_place_id, :vp_ne_lat, :vp_ne_lng, :vp_sw_lat, :vp_sw_lng, :db_add_date, :image, :tag0, :tag1, :tag2, :tag3, :description, :facebook, :soldes, :instagram, :website, :street_name, :horaires,:user_id)
    end
end
