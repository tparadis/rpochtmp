class CategoriesControllersController < ApplicationController
  before_action :set_categories_controller, only: [:show, :edit, :update, :destroy]

  # GET /categories_controllers
  # GET /categories_controllers.json
  def index
    @categories_controllers = CategoriesController.all
  end

  # GET /categories_controllers/1
  # GET /categories_controllers/1.json
  def show
  end

  # GET /categories_controllers/new
  def new
    @categories_controller = CategoriesController.new
  end

  # GET /categories_controllers/1/edit
  def edit
  end

  # POST /categories_controllers
  # POST /categories_controllers.json
  def create
    @categories_controller = CategoriesController.new(categories_controller_params)

    respond_to do |format|
      if @categories_controller.save
        format.html { redirect_to @categories_controller, notice: 'Categories controller was successfully created.' }
        format.json { render :show, status: :created, location: @categories_controller }
      else
        format.html { render :new }
        format.json { render json: @categories_controller.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /categories_controllers/1
  # PATCH/PUT /categories_controllers/1.json
  def update
    respond_to do |format|
      if @categories_controller.update(categories_controller_params)
        format.html { redirect_to @categories_controller, notice: 'Categories controller was successfully updated.' }
        format.json { render :show, status: :ok, location: @categories_controller }
      else
        format.html { render :edit }
        format.json { render json: @categories_controller.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /categories_controllers/1
  # DELETE /categories_controllers/1.json
  def destroy
    @categories_controller.destroy
    respond_to do |format|
      format.html { redirect_to categories_controllers_url, notice: 'Categories controller was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_categories_controller
      @categories_controller = CategoriesController.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def categories_controller_params
      params[:categories_controller]
    end
end
