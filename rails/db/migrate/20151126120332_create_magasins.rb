class CreateMagasins < ActiveRecord::Migration
  def change
    create_table :magasins do |t|
      t.string :nom
      t.float :latitude
      t.float :longitude

      t.timestamps null: false
    end
  end
end
