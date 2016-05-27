class AddUserToCommerces < ActiveRecord::Migration
  def change
    add_reference :commerces, :user, index: true, foreign_key: true
  end
end
