class CreateTokenmails < ActiveRecord::Migration
  def change
    create_table :tokenmails do |t|
      t.string :mail
      t.string :token

      t.timestamps null: false
    end
  end
end
