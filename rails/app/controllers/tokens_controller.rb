class TokensController < ApplicationController
  before_action  only: [:new, :create, :changemdp, :reinit]
  before_action :require_admin, only: [:index, :show, :edit, :update, :destroy]

  # GET /tokens
  # GET /tokens.json
  def index
    @tokens = Token.all
  end

  # GET /tokens/1
  # GET /tokens/1.json
  def show
  end

  # GET /tokens/new
  def new
    @token = Token.new
  end

  # GET /tokens/1/edit
  def edit
  end

  # POST /tokens
  # POST /tokens.json
  def create
	#On initialize le token
    @token = Token.new(token_params)
	@token.valide = true
	session[:mailToken] = @token.mail
	@token.valeur = SecureRandom.urlsafe_base64(nil, false) 
	mailExists = User.where('email = ?', @token.mail).first
	if !mailExists.present?

		flash[:danger] = "Erreur, le mail n'existe pas."
		redirect_to :new

	else
		Token.destroy_all(mail: @token.mail)
    	if !@token.save
			flash[:danger] = "Une erreur est survenue lors de la generation du token"
			redirect_to :new
		else
			render :changemdp
		end
	end
    
  end

  #Action pour pouvoir reclamer son token et changer
  #son mot de passe
  
  def changemdp
  end

  #Action pour reinitialiser le mot de passe
  #Utilisation des tokens

  def reinit
  	@params = params.keys
	if params.has_key?(:password) && params.has_key?(:password_confirmation) && params.has_key?(:valeur)
	
		@tokenRetrieve = Token.where('valeur = ?',params[:valeur]).first
		
		if @tokenRetrieve.present? && @tokenRetrieve.mail == session[:mailToken] && params[:valeur] != ""
		
			if password_valid(params[:password]) && params[:password] == params[:password_confirmation]

				if @tokenRetrieve.created_at > 10.minutes.ago

					@newUser = User.where('email = ?', @tokenRetrieve.mail).first
					@newUser.password = params[:password]
					if @newUser.save
						Token.destroy_all(mail: @tokenRetrieve.mail)	
						flash[:succes] = "Votre mot de passe a bien été changé."
						redirect_to :login
					end
				else
					Token.where("valeur = ?", @tokenRetrieve.valeur).first.destroy
					flash.now[:danger] = "Le token fourni est périmé"

				end

			else

				flash.now[:danger] = "Erreur, les mots de passes ne sont pas corrects ou ne sont pas identiques ou sont plus petits que 8 caractères"
				render :changemdp
			end


		else
			flash.now[:danger] = "Erreur, le token n'est pas valide."
		end


	else
		#le formulaire n'était pas valide
		flash.now[:danger] = "Erreur, le formulaire n'avait pas la structure requise pour continuer..."
	end

  end


  # PATCH/PUT /tokens/1
  # PATCH/PUT /tokens/1.json
  def update
    respond_to do |format|
      if @token.update(token_params)
        format.html { redirect_to @token, notice: 'Token was successfully updated.' }
        format.json { render :show, status: :ok, location: @token }
      else
        format.html { render :edit }
        format.json { render json: @token.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tokens/1
  # DELETE /tokens/1.json
  def destroy
    @token = Token.find(params[:id])
    @token.destroy
    respond_to do |format|
      format.html { redirect_to tokens_url, notice: 'Token was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_token
      @token = Token.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def token_params
      params.require(:token).permit(:mail, :valeur, :valide)
    end

	def password_valid(str)

		str.length >= 8

	end

end
