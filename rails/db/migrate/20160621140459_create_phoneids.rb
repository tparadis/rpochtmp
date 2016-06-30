class CreatePhoneids < ActiveRecord::Migration
  def change
    create_table :phoneids, :id => false  do |t|
	  t.uuid :id, :primary_key => true
      t.string :info

      t.timestamps null: false
    end
  end
end
