class MagasinsController < ApplicationController
  before_action :set_magasin, only: [:show, :edit, :update, :destroy]

  # GET /magasins
  # GET /magasins.json
  def index
    @magasins = Magasin.all
  end

  # GET /magasins/1
  # GET /magasins/1.json
  def show
  end

  # GET /magasins/new
  def new
    @magasin = Magasin.new
  end

  # GET /magasins/1/edit
  def edit
  end

  # POST /magasins
  # POST /magasins.json
  def create
    @magasin = Magasin.new(magasin_params)

    respond_to do |format|
      if @magasin.save
        format.html { redirect_to @magasin, notice: 'Magasin was successfully created.' }
        format.json { render :show, status: :created, location: @magasin }
      else
        format.html { render :new }
        format.json { render json: @magasin.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /magasins/1
  # PATCH/PUT /magasins/1.json
  def update
    respond_to do |format|
      if @magasin.update(magasin_params)
        format.html { redirect_to @magasin, notice: 'Magasin was successfully updated.' }
        format.json { render :show, status: :ok, location: @magasin }
      else
        format.html { render :edit }
        format.json { render json: @magasin.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /magasins/1
  # DELETE /magasins/1.json
  def destroy
    @magasin.destroy
    respond_to do |format|
      format.html { redirect_to magasins_url, notice: 'Magasin was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_magasin
      @magasin = Magasin.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def magasin_params
      params.require(:magasin).permit(:nom, :latitude, :longitude)
    end
end
