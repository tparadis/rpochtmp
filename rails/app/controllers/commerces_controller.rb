class CommercesController < ApplicationController
  
  include Admin

  before_action :set_commerce, only: [:show, :edit, :update, :destroy]

  # GET /commerces
  # GET /commerces.json
  def index
    @commerces = Commerce.all
  end

  # GET /commerces/1
  # GET /commerces/1.json
  def show
  end

  # GET /commerces/new
  def new
    @commerce = Commerce.new
  end

  # GET /commerces/1/edit
  def edit
  end

  # POST /commerces
  # POST /commerces.json
  def create
    @commerce = Commerce.new(commerce_params)

    respond_to do |format|
      if @commerce.save
        format.html { redirect_to @commerce, notice: 'Commerce was successfully created.' }
        format.json { render :show, status: :created, location: @commerce }
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
      if @commerce.update(commerce_params)
        format.html { redirect_to @commerce, notice: 'Commerce was successfully updated.' }
        format.json { render :show, status: :ok, location: @commerce }
      else
        format.html { render :edit }
        format.json { render json: @commerce.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /commerces/1
  # DELETE /commerces/1.json
  def destroy
    @commerce.destroy
    respond_to do |format|
      format.html { redirect_to commerces_url, notice: 'Commerce was successfully destroyed.' }
      format.json { head :no_content }
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
	params.require(:commerce).permit(:id, :line, :siret, :enseigne, :rasoc, :date_deb_act, :date_rad, :code_ape, :label_ape, :zone_ape, :label_zone_ape, :street_num, :sort_street_name, :city_code, :city_label, :epci2014, :phone_num, :fax_num, :email, :street_number, :route, :city, :dptmt, :region, :country, :postal_code, :location_lat, :location_lng, :location_type, :google_place_id, :vp_ne_lat, :vp_ne_lng, :vp_sw_lat, :vp_sw_lng, :db_add_date, :image, :tag0, :tag1, :tag2, :tag3, :tag4, :tag5, :description, :facebook)
    end
end
