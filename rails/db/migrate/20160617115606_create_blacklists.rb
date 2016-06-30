class CreateBlacklists < ActiveRecord::Migration
  def change
    create_table :blacklists do |t|
      t.string :siret
      t.string :enseigne
      t.string :rasoc

      t.timestamps null: false
    end
  end
end
