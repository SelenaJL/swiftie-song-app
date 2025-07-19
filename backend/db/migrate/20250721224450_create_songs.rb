class CreateSongs < ActiveRecord::Migration[8.0]
  def change
    create_table :songs do |t|
      t.string :title
      t.references :album, null: false, foreign_key: true
      t.string :spotify_track_id
      t.string :rerecorded_spotify_track_id
      t.boolean :from_the_vault, default: false
      t.string :feature

      t.timestamps
    end
  end
end
