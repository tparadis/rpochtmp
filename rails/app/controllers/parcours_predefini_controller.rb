class ParcoursPredefiniController < ApplicationController
  def index
  	@parcours_predefini = Parcours_Predefini.all
  end

  def new
  end

  def create
  end

  def show
  end

  def destroy
  end
end
