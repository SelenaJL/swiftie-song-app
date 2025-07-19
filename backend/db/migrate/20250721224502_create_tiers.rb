class CreateTiers < ActiveRecord::Migration[8.0]
  def change
    create_table :tiers do |t|
      t.string :name
      t.text :description
      t.integer :value

      t.timestamps
    end
  end
end
