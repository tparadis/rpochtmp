class CreateSscategories < ActiveRecord::Migration
  def change
    create_table :sscategories do |t|
      t.string :nom

      t.timestamps null: false
    end
  end
end
