class CreateTutos < ActiveRecord::Migration
  def change
    create_table :tutos do |t|
      t.string :fr
      t.string :de
      t.string :esp
      t.string :en
      t.string :page

      t.timestamps null: false
    end
  end
end
