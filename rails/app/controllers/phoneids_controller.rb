class PhoneidsController < ApplicationController
  before_action :set_phoneid, only: [:show, :edit, :update, :destroy]

  # GET /phoneids
  # GET /phoneids.json
  def index
    @phoneids = Phoneid.all
  end

  # GET /phoneids/1
  # GET /phoneids/1.json
  def show
  end

  # GET /phoneids/new
  def new
    @phoneid = Phoneid.new
  end

  # GET /phoneids/1/edit
  def edit
  end

  # POST /phoneids
  # POST /phoneids.json
  def create
    @phoneid = Phoneid.new(phoneid_params)

    respond_to do |format|
      if @phoneid.save
        format.html { redirect_to @phoneid, notice: 'Phoneid was successfully created.' }
        format.json { render :show, status: :created, location: @phoneid }
      else
        format.html { render :new }
        format.json { render json: @phoneid.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /phoneids/1
  # PATCH/PUT /phoneids/1.json
  def update
    respond_to do |format|
      if @phoneid.update(phoneid_params)
        format.html { redirect_to @phoneid, notice: 'Phoneid was successfully updated.' }
        format.json { render :show, status: :ok, location: @phoneid }
      else
        format.html { render :edit }
        format.json { render json: @phoneid.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /phoneids/1
  # DELETE /phoneids/1.json
  def destroy
    @phoneid.destroy
    respond_to do |format|
      format.html { redirect_to phoneids_url, notice: 'Phoneid was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_phoneid
      @phoneid = Phoneid.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def phoneid_params
      params.require(:phoneid).permit(:info)
    end
end
