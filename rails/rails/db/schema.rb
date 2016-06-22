# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160621140459) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "blacklists", force: :cascade do |t|
    t.string   "siret"
    t.string   "enseigne"
    t.string   "rasoc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string   "nom"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.string   "reference"
    t.text     "en"
    t.text     "esp"
    t.text     "de"
    t.text     "ko"
    t.text     "jap"
    t.boolean  "visible",    default: true
    t.integer  "stat",       default: 0
  end

  create_table "commerces", id: :uuid, default: "uuid_generate_v4()", force: :cascade do |t|
    t.integer  "line"
    t.text     "siret"
    t.text     "enseigne"
    t.text     "rasoc"
    t.date     "date_deb_act"
    t.date     "date_rad"
    t.text     "code_ape"
    t.text     "label_ape"
    t.text     "zone_ape"
    t.text     "label_zone_ape"
    t.text     "street_num"
    t.text     "street_name"
    t.text     "sort_street_name"
    t.text     "city_code"
    t.text     "city_label"
    t.text     "epci2014"
    t.text     "phone_num"
    t.text     "fax_num"
    t.text     "email"
    t.text     "street_number"
    t.text     "route"
    t.text     "city"
    t.text     "dptmt"
    t.text     "region"
    t.text     "country"
    t.text     "postal_code"
    t.float    "location_lat"
    t.float    "location_lng"
    t.text     "location_type"
    t.text     "google_place_id"
    t.float    "vp_ne_lat"
    t.float    "vp_ne_lng"
    t.float    "vp_sw_lat"
    t.float    "vp_sw_lng"
    t.datetime "db_add_date",                  default: '2016-03-21 14:01:36', null: false
    t.text     "image",                        default: "noimage.jpg"
    t.integer  "tag0"
    t.integer  "tag1"
    t.integer  "tag2"
    t.integer  "tag3"
    t.text     "description"
    t.text     "facebook"
    t.integer  "nbvisites"
    t.integer  "user_id"
    t.boolean  "soldes",                       default: false
    t.string   "website",          limit: 255
    t.string   "instagram",        limit: 255
    t.json     "horaires",                     default: {}
  end

  add_index "commerces", ["user_id"], name: "index_commerces_on_user_id", using: :btree

  create_table "notes", force: :cascade do |t|
    t.integer  "note"
    t.text     "commerce"
    t.text     "commentaire"
    t.string   "idtel"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "parcours_predefinis", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "image"
    t.uuid     "commerces",                                array: true
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.text     "en"
    t.text     "esp"
    t.text     "de"
    t.text     "fr"
    t.boolean  "visible",     default: false
  end

  create_table "phoneids", id: :uuid, default: nil, force: :cascade do |t|
    t.string   "info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "promotions", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "kbis"
    t.string   "rid"
    t.string   "siret"
  end

  add_index "promotions", ["user_id"], name: "index_promotions_on_user_id", using: :btree

  create_table "requests", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "requests", ["user_id"], name: "index_requests_on_user_id", using: :btree

  create_table "resultats", force: :cascade do |t|
    t.uuid     "magasin"
    t.string   "objet"
    t.text     "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sscategories", force: :cascade do |t|
    t.string   "nom"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "catparent"
    t.text     "en"
    t.text     "esp"
    t.text     "de"
    t.text     "ko"
    t.text     "jap"
    t.integer  "stat",       default: 0
  end

  create_table "stats", force: :cascade do |t|
    t.uuid     "commerce"
    t.datetime "date_visite"
    t.string   "parcours"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string   "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tokens", force: :cascade do |t|
    t.string   "mail"
    t.string   "valeur"
    t.boolean  "valide"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tutos", force: :cascade do |t|
    t.string   "fr"
    t.string   "de"
    t.string   "esp"
    t.string   "en"
    t.string   "page"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "username"
    t.string   "status"
    t.string   "salt"
    t.string   "password_digest"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_foreign_key "commerces", "users"
  add_foreign_key "promotions", "users"
  add_foreign_key "requests", "users"
end
