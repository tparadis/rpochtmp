class AddCategorieToCommerces < ActiveRecord::Migration
  def change
    add_reference :commerces, :categorie, index: true, foreign_key: true
  end
end
