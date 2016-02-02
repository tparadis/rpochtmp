class ParcoursPredefinisController < ApplicationController
  
  include Admin
  
  before_action :set_parcours_predefini, only: [:show, :edit, :update, :destroy]

  # GET /parcours_predefinis
  # GET /parcours_predefinis.json
  def index
    @parcours_predefinis = ParcoursPredefini.all
  end

  # GET /parcours_predefinis/1
  # GET /parcours_predefinis/1.json
  def show
  end

  # GET /parcours_predefinis/new
  def new
    @parcours_predefini = ParcoursPredefini.new
  end

  # GET /parcours_predefinis/1/edit
  def edit
  end

  # POST /parcours_predefinis
  # POST /parcours_predefinis.json
  def create
    @parcours_predefini = ParcoursPredefini.new(parcours_predefini_params)

    respond_to do |format|
      if @parcours_predefini.save
        format.html { redirect_to @parcours_predefini, notice: 'Parcours predefini was successfully created.' }
        format.json { render :show, status: :created, location: @parcours_predefini }
      else
        format.html { render :new }
        format.json { render json: @parcours_predefini.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parcours_predefinis/1
  # PATCH/PUT /parcours_predefinis/1.json
  def update
    respond_to do |format|
      if @parcours_predefini.update(parcours_predefini_params)
        format.html { redirect_to @parcours_predefini, notice: 'Parcours predefini was successfully updated.' }
        format.json { render :show, status: :ok, location: @parcours_predefini }
      else
        format.html { render :edit }
        format.json { render json: @parcours_predefini.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /parcours_predefinis/1
  # DELETE /parcours_predefinis/1.json
  def destroy
    @parcours_predefini.destroy
    respond_to do |format|
      format.html { redirect_to parcours_predefinis_url, notice: 'Parcours predefini was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_parcours_predefini
      @parcours_predefini = ParcoursPredefini.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def parcours_predefini_params
      params.require(:parcours_predefini).permit(:name, :description, :image, :commerces)
    end
end
