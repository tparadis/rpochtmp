class CreateParcoursPredefinis < ActiveRecord::Migration
  def change
    create_table :parcours_predefinis do |t|
      t.string :name
      t.text :description
      t.string :image
      t.uuid :commerces, array: true

      t.timestamps null: false
    end
  end
end
