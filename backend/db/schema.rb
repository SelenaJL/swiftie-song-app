# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_21_231159) do
  create_table "albums", force: :cascade do |t|
    t.string "title"
    t.integer "release_year"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rankings", force: :cascade do |t|
    t.integer "song_id", null: false
    t.integer "tier_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["song_id"], name: "index_rankings_on_song_id"
    t.index ["tier_id"], name: "index_rankings_on_tier_id"
    t.index ["user_id"], name: "index_rankings_on_user_id"
  end

  create_table "songs", force: :cascade do |t|
    t.string "title"
    t.integer "album_id", null: false
    t.string "spotify_track_id"
    t.string "rerecorded_spotify_track_id"
    t.boolean "from_the_vault", default: false
    t.string "feature"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["album_id"], name: "index_songs_on_album_id"
  end

  create_table "tiers", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
  end

  add_foreign_key "rankings", "songs"
  add_foreign_key "rankings", "tiers"
  add_foreign_key "rankings", "users"
  add_foreign_key "songs", "albums"
end
