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

ActiveRecord::Schema.define(version: 20160121175545) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "categories", force: :cascade do |t|
    t.string   "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "reference"
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
    t.datetime "db_add_date",      default: "now()",       null: false
    t.text     "image",            default: "noimage.jpg"
    t.integer  "category_id"
    t.integer  "categorie_id"
  end

  add_index "commerces", ["categorie_id"], name: "index_commerces_on_categorie_id", using: :btree

  create_table "parcours_predefinis", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "image"
    t.uuid     "commerces",                array: true
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "sscategories", force: :cascade do |t|
    t.string   "nom"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "commerces", "categories"
end
