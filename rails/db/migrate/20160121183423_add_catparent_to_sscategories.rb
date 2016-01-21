class AddCatparentToSscategories < ActiveRecord::Migration
  def change
    add_column :sscategories, :reference, :int
  end
end
