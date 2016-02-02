--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Commerce; Type: TABLE; Schema: public; Owner: max; Tablespace: 
--

CREATE TABLE "Commerce" (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    line integer,
    siret text,
    enseigne text,
    rasoc text,
    date_deb_act date,
    date_rad date,
    code_ape text,
    label_ape text,
    zone_ape text,
    label_zone_ape text,
    street_num text,
    street_name text,
    sort_street_name text,
    city_code text,
    city_label text,
    epci2014 text,
    phone_num text,
    fax_num text,
    email text,
    street_number text,
    route text,
    city text,
    dptmt text,
    region text,
    country text,
    postal_code text,
    location_lat double precision,
    location_lng double precision,
    location_type text,
    google_place_id text,
    vp_ne_lat double precision,
    vp_ne_lng double precision,
    vp_sw_lat double precision,
    vp_sw_lng double precision,
    db_add_date timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE "Commerce" OWNER TO rails;

--
-- Name: COLUMN "Commerce".id; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".id IS 'identifiant commerce de la bdd';


--
-- Name: COLUMN "Commerce".line; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".line IS 'Numéro de ligne (dans le fichier cci)';


--
-- Name: COLUMN "Commerce".siret; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".siret IS 'Siret';


--
-- Name: COLUMN "Commerce".enseigne; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".enseigne IS 'Enseigne';


--
-- Name: COLUMN "Commerce".rasoc; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".rasoc IS 'Raison sociale';


--
-- Name: COLUMN "Commerce".date_deb_act; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".date_deb_act IS 'Date début activité';


--
-- Name: COLUMN "Commerce".date_rad; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".date_rad IS 'Date radiation';


--
-- Name: COLUMN "Commerce".code_ape; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".code_ape IS 'Code APE';


--
-- Name: COLUMN "Commerce".label_ape; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".label_ape IS 'Libellé code APE';


--
-- Name: COLUMN "Commerce".zone_ape; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".zone_ape IS 'Zone appartenance APE';


--
-- Name: COLUMN "Commerce".label_zone_ape; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".label_zone_ape IS 'Libellé zone appartenance APE';


--
-- Name: COLUMN "Commerce".street_num; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".street_num IS 'Numéro de voie';


--
-- Name: COLUMN "Commerce".street_name; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".street_name IS 'Nom de voie';


--
-- Name: COLUMN "Commerce".sort_street_name; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".sort_street_name IS 'Tri Nom de voie';


--
-- Name: COLUMN "Commerce".city_code; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".city_code IS 'Commune';


--
-- Name: COLUMN "Commerce".city_label; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".city_label IS 'Libellé commune';


--
-- Name: COLUMN "Commerce".epci2014; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".epci2014 IS 'EPCI 2014';


--
-- Name: COLUMN "Commerce".phone_num; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".phone_num IS 'Téléphone';


--
-- Name: COLUMN "Commerce".fax_num; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".fax_num IS 'Fax';


--
-- Name: COLUMN "Commerce".email; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".email IS 'Email';


--
-- Name: COLUMN "Commerce".street_number; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".street_number IS 'Numéro de rue (Google)';


--
-- Name: COLUMN "Commerce".route; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".route IS 'Nom de la rue (Google)';


--
-- Name: COLUMN "Commerce".city; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".city IS 'Nom de la ville (Google)';


--
-- Name: COLUMN "Commerce".dptmt; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".dptmt IS 'Nom du département (Google)';


--
-- Name: COLUMN "Commerce".region; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".region IS 'Nom de la région (Google)';


--
-- Name: COLUMN "Commerce".country; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".country IS 'Nom du pays (Google)';


--
-- Name: COLUMN "Commerce".postal_code; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".postal_code IS 'Code postal (Google)';


--
-- Name: COLUMN "Commerce".location_lat; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".location_lat IS 'Localisation latitude (Google)';


--
-- Name: COLUMN "Commerce".location_lng; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".location_lng IS 'Localisation longitude (Google)';


--
-- Name: COLUMN "Commerce".location_type; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".location_type IS 'Type de coordonnées (Google)';


--
-- Name: COLUMN "Commerce".google_place_id; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".google_place_id IS 'Identifiant du lieu (Google)';


--
-- Name: COLUMN "Commerce".vp_ne_lat; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".vp_ne_lat IS 'Loc. nord est latitude (Google)';


--
-- Name: COLUMN "Commerce".vp_ne_lng; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".vp_ne_lng IS 'Loc. nord est longitude (Google)';


--
-- Name: COLUMN "Commerce".vp_sw_lat; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".vp_sw_lat IS 'Loc. sud ouest latitude (Google)';


--
-- Name: COLUMN "Commerce".vp_sw_lng; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".vp_sw_lng IS 'Loc. sud ouest longitude (Google)';


--
-- Name: COLUMN "Commerce".db_add_date; Type: COMMENT; Schema: public; Owner: max
--

COMMENT ON COLUMN "Commerce".db_add_date IS 'Date d''ajout à la base de données';


--
-- Name: Commerce_pkey; Type: CONSTRAINT; Schema: public; Owner: max; Tablespace: 
--

ALTER TABLE ONLY "Commerce"
    ADD CONSTRAINT "Commerce_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

