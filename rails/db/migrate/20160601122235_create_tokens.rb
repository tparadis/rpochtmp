class CreateTokens < ActiveRecord::Migration
  def change
    create_table :tokens do |t|
      t.string :mail
      t.string :valeur
      t.boolean :valide

      t.timestamps null: false
    end
  end
end
