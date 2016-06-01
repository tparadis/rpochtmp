class SscategoriesController < ApplicationController
  
  before_action :require_admin, only: [:index, :show, :edit, :update, :destroy]

  # GET /sscategories
  # GET /sscategories.json
  def index
    @sscategories = Sscategory.order('nom')
  end

  # GET /sscategories/1
  # GET /sscategories/1.json
  def show
  	@sscategory = Sscategory.find(params[:id])
  end

  # GET /sscategories/new
  def new
    @sscategory = Sscategory.new
  end

  # GET /sscategories/1/edit
  def edit
  	@sscategory = Sscategory.find(params[:id])
  end

  # POST /sscategories
  # POST /sscategories.json
  def create
    @sscategory = Sscategory.new(sscategory_params)

    respond_to do |format|
      if @sscategory.save
        format.html { redirect_to @sscategory, notice: 'Sscategory was successfully created.' }
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
  	@sscategory = Sscategory.find(params[:id])
    respond_to do |format|
      if @sscategory.update(sscategory_params)
        format.html { redirect_to @sscategory, notice: 'Sscategory was successfully updated.' }
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
      format.html { redirect_to sscategories_url, notice: 'Sscategory was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sscategory
      @sscategory = Sscategory.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sscategory_params
      params.require(:sscategory).permit(:nom, :catparent, :en, :esp, :de, :jap, :ko)
    end
end
