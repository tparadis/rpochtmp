class AddSsmenuColumnToSscategories < ActiveRecord::Migration
  def change
    add_column :sscategories, :ssmenu, :boolean
  end
end
