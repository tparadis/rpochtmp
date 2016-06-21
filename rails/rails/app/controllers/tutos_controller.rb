class TutosController < ApplicationController
  before_action :require_admin
  before_action :set_tuto, only: [:show, :edit, :update, :destroy]

  # GET /tutos
  # GET /tutos.json
  def index
    @tutos = Tuto.all
  end

  # GET /tutos/1
  # GET /tutos/1.json
  def show
  end

  # GET /tutos/new
  def new
    @tuto = Tuto.new
  end

  # GET /tutos/1/edit
  def edit
  end

  # POST /tutos
  # POST /tutos.json
  def create
    @tuto = Tuto.new(tuto_params)

    respond_to do |format|
      if @tuto.save
        format.html { redirect_to @tuto, notice: 'Tuto was successfully created.' }
        format.json { render :show, status: :created, location: @tuto }
      else
        format.html { render :new }
        format.json { render json: @tuto.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tutos/1
  # PATCH/PUT /tutos/1.json
  def update
    respond_to do |format|
      if @tuto.update(tuto_params)
        format.html { redirect_to @tuto, notice: 'Tuto was successfully updated.' }
        format.json { render :show, status: :ok, location: @tuto }
      else
        format.html { render :edit }
        format.json { render json: @tuto.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tutos/1
  # DELETE /tutos/1.json
  def destroy
    @tuto.destroy
    respond_to do |format|
      format.html { redirect_to tutos_url, notice: 'Tuto was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tuto
      @tuto = Tuto.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tuto_params
      params.require(:tuto).permit(:fr, :de, :esp, :en, :page)
    end
end
