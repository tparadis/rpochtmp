class CreateCategoriesControllers < ActiveRecord::Migration
  def change
    create_table :categories_controllers do |t|

      t.timestamps null: false
    end
  end
end
