class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :nom

      t.timestamps null: false
    end
  end
end
