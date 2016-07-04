class AddStatsToParcoursPredefinis < ActiveRecord::Migration
  def change
    add_column :parcours_predefinis, :stats, :int, :default => 0
  end
end
