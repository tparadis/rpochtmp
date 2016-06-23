class AddSsmenuColumnToCommerces < ActiveRecord::Migration
  def change
    add_column :commerces, :ssmenu, :boolean
  end
end
