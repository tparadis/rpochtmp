class CreateResultats < ActiveRecord::Migration
  def change
    create_table :resultats do |t|
      t.uuid :magasin
      t.string :type
      t.text :message

      t.timestamps null: false
    end
  end
end
