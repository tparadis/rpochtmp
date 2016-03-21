class ResultatsController < ApplicationController
  before_action :set_resultat, only: [:show, :edit, :update, :destroy]

  # GET /resultats
  # GET /resultats.json
  def index
    @resultats = Resultat.all
  end

  # GET /resultats/1
  # GET /resultats/1.json
  def show
  end

  # GET /resultats/new
  def new
    @resultat = Resultat.new
  end

  # GET /resultats/1/edit
  def edit
  end

  # POST /resultats
  # POST /resultats.json
  def create
    @resultat = Resultat.new(resultat_params)

    respond_to do |format|
      if @resultat.save
        format.html { redirect_to @resultat, notice: 'Resultat was successfully created.' }
        format.json { render :show, status: :created, location: @resultat }
      else
        format.html { render :new }
        format.json { render json: @resultat.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /resultats/1
  # PATCH/PUT /resultats/1.json
  def update
    respond_to do |format|
      if @resultat.update(resultat_params)
        format.html { redirect_to @resultat, notice: 'Resultat was successfully updated.' }
        format.json { render :show, status: :ok, location: @resultat }
      else
        format.html { render :edit }
        format.json { render json: @resultat.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /resultats/1
  # DELETE /resultats/1.json
  def destroy
    @resultat.destroy
    respond_to do |format|
      format.html { redirect_to resultats_url, notice: 'Resultat was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_resultat
      @resultat = Resultat.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def resultat_params
      params.require(:resultat).permit(:magasin, :objet, :message)
    end
end
