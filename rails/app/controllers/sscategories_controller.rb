class SscategoriesController < ApplicationController
  before_action :set_sscategory, only: [:show, :edit, :update, :destroy]

  # GET /sscategories
  # GET /sscategories.json
  def index
    @sscategories = Sscategorie.all
  end

  # GET /sscategories/1
  # GET /sscategories/1.json
  def show
  end

  # GET /sscategories/new
  def new
    @sscategory = Sscategorie.new
  end

  # GET /sscategories/1/edit
  def edit
  end

  # POST /sscategories
  # POST /sscategories.json
  def create
    @sscategory = Sscategorie.new(sscategory_params)

    respond_to do |format|
      if @sscategory.save
        format.html { redirect_to @sscategory, notice: 'Sscategorie was successfully created.' }
        format.json { render :show, status: :created, location: @sscategory }
      else
        format.html { render :new }
        format.json { render json: @sscategory.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /sscategories/1
  # PATCH/PUT /sscategories/1.json
  def update
    respond_to do |format|
      if @sscategory.update(sscategory_params)
        format.html { redirect_to @sscategory, notice: 'Sscategorie was successfully updated.' }
        format.json { render :show, status: :ok, location: @sscategory }
      else
        format.html { render :edit }
        format.json { render json: @sscategory.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sscategories/1
  # DELETE /sscategories/1.json
  def destroy
    @sscategory.destroy
    respond_to do |format|
      format.html { redirect_to sscategories_url, notice: 'Sscategorie was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sscategory
      @sscategory = Sscategorie.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sscategory_params
      params.require(:sscategorie).permit(:nom)
    end
end
