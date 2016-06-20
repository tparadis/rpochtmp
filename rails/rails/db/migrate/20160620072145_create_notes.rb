class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.integer :note
      t.string :commerce
      t.text :commentaire
      t.string :idtel

      t.timestamps null: false
    end
  end
end
