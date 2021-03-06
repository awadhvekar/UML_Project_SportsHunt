PGDMP             
            x        
   sportshunt    12.2    12.2 "    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    25636 
   sportshunt    DATABASE     �   CREATE DATABASE sportshunt WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE sportshunt;
                postgres    false            �           0    0    DATABASE sportshunt    COMMENT     [   COMMENT ON DATABASE sportshunt IS 'database for UML project for storing relational data.';
                   postgres    false    3720                        3079    42440    postgis 	   EXTENSION     ;   CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
    DROP EXTENSION postgis;
                   false            �           0    0    EXTENSION postgis    COMMENT     g   COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';
                        false    2            �            1259    50612    divvy_stations_realtime_status    TABLE     [  CREATE TABLE public.divvy_stations_realtime_status (
    altitude double precision,
    availablebikes integer,
    availabledocks integer,
    city text,
    id integer,
    is_renting boolean,
    kiosktype text,
    landmark text,
    lastcommunicationtime timestamp without time zone,
    latitude double precision,
    location text,
    longitude double precision,
    postalcode integer,
    staddress1 text,
    staddress2 text,
    stationname text,
    status text,
    statuskey integer,
    statusvalue text,
    teststation boolean,
    totaldocks integer,
    where_is public.geography
);
 2   DROP TABLE public.divvy_stations_realtime_status;
       public         heap    postgres    false    2    2    2    2    2    2    2    2            �            1259    25997    ticket_orders    TABLE     �  CREATE TABLE public.ticket_orders (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    event_id integer,
    event_name character varying(200) NOT NULL,
    ticket_price real DEFAULT 0 NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL,
    ticketmaster_event_id character varying(200) NOT NULL,
    order_sports_name character varying(200),
    order_city character varying(200),
    order_date character varying(200),
    payment_flag boolean DEFAULT true
);
 !   DROP TABLE public.ticket_orders;
       public         heap    postgres    false            �           0    0    TABLE ticket_orders    COMMENT     �   COMMENT ON TABLE public.ticket_orders IS 'INSERT INTO ticket_orders (user_id, event_name, ticketmaster_event_id, order_city, order_date, order_sports_name) VALUES (1, '''', ''random&*String!2#$#'', null, null, null);';
          public          postgres    false    206            �           0    0 !   COLUMN ticket_orders.payment_flag    COMMENT     i   COMMENT ON COLUMN public.ticket_orders.payment_flag IS 'TRUE -> Payment Done
FALSE -> Payment not Done';
          public          postgres    false    206            �            1259    25995    ticket_orders_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ticket_orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.ticket_orders_order_id_seq;
       public          postgres    false    206            �           0    0    ticket_orders_order_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.ticket_orders_order_id_seq OWNED BY public.ticket_orders.order_id;
          public          postgres    false    205            �            1259    26012    ticket_payments    TABLE     �  CREATE TABLE public.ticket_payments (
    payment_id integer NOT NULL,
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    number_of_tickets integer NOT NULL,
    total_price real NOT NULL,
    credit_card_number character varying(20) NOT NULL,
    address character varying(200),
    payment_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now()
);
 #   DROP TABLE public.ticket_payments;
       public         heap    postgres    false            �            1259    26010    ticket_payments_payment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ticket_payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.ticket_payments_payment_id_seq;
       public          postgres    false    208            �           0    0    ticket_payments_payment_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.ticket_payments_payment_id_seq OWNED BY public.ticket_payments.payment_id;
          public          postgres    false    207            �            1259    25637    users    TABLE     �  CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(200) NOT NULL,
    last_name character varying(200) NOT NULL,
    email_id character varying(200) NOT NULL,
    account_password character varying NOT NULL,
    created_date timestamp without time zone DEFAULT now() NOT NULL,
    updated_date timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �           0    0    TABLE users    COMMENT     �   COMMENT ON TABLE public.users IS 'INSERT INTO users (first_name, last_name, email_id, account_password) VALUES (''Ashutosh'', ''Wadhvekar'', ''awadhvekar@gmail.com'', ''SportsHunt@123'');

';
          public          postgres    false    203            �           0    0    COLUMN users.user_id    COMMENT     9   COMMENT ON COLUMN public.users.user_id IS 'Primary Key';
          public          postgres    false    203            �            1259    25980    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    203            �           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    204            �           2604    26000    ticket_orders order_id    DEFAULT     �   ALTER TABLE ONLY public.ticket_orders ALTER COLUMN order_id SET DEFAULT nextval('public.ticket_orders_order_id_seq'::regclass);
 E   ALTER TABLE public.ticket_orders ALTER COLUMN order_id DROP DEFAULT;
       public          postgres    false    206    205    206            �           2604    26015    ticket_payments payment_id    DEFAULT     �   ALTER TABLE ONLY public.ticket_payments ALTER COLUMN payment_id SET DEFAULT nextval('public.ticket_payments_payment_id_seq'::regclass);
 I   ALTER TABLE public.ticket_payments ALTER COLUMN payment_id DROP DEFAULT;
       public          postgres    false    207    208    208            �           2604    25982    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    204    203            �           2606    26002     ticket_orders ticket_orders_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.ticket_orders
    ADD CONSTRAINT ticket_orders_pkey PRIMARY KEY (order_id);
 J   ALTER TABLE ONLY public.ticket_orders DROP CONSTRAINT ticket_orders_pkey;
       public            postgres    false    206            �           2606    26017 $   ticket_payments ticket_payments_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.ticket_payments
    ADD CONSTRAINT ticket_payments_pkey PRIMARY KEY (payment_id);
 N   ALTER TABLE ONLY public.ticket_payments DROP CONSTRAINT ticket_payments_pkey;
       public            postgres    false    208            �           2606    25992    users unique email_id 
   CONSTRAINT     V   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "unique email_id" UNIQUE (email_id);
 A   ALTER TABLE ONLY public.users DROP CONSTRAINT "unique email_id";
       public            postgres    false    203            �           2606    25987    users user table PK 
   CONSTRAINT     X   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "user table PK" PRIMARY KEY (user_id);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT "user table PK";
       public            postgres    false    203            �           1259    26008    fki_Users_FK_Ticket_orders    INDEX     Y   CREATE INDEX "fki_Users_FK_Ticket_orders" ON public.ticket_orders USING btree (user_id);
 0   DROP INDEX public."fki_Users_FK_Ticket_orders";
       public            postgres    false    206            �           1259    26023    fki_Users_FK_payments    INDEX     V   CREATE INDEX "fki_Users_FK_payments" ON public.ticket_payments USING btree (user_id);
 +   DROP INDEX public."fki_Users_FK_payments";
       public            postgres    false    208            �           1259    26029    fki_orders_FK_payments    INDEX     X   CREATE INDEX "fki_orders_FK_payments" ON public.ticket_payments USING btree (order_id);
 ,   DROP INDEX public."fki_orders_FK_payments";
       public            postgres    false    208            �           2606    26003 $   ticket_orders Users_FK_Ticket_orders    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_orders
    ADD CONSTRAINT "Users_FK_Ticket_orders" FOREIGN KEY (user_id) REFERENCES public.users(user_id) NOT VALID;
 P   ALTER TABLE ONLY public.ticket_orders DROP CONSTRAINT "Users_FK_Ticket_orders";
       public          postgres    false    3571    206    203            �           2606    26018 !   ticket_payments Users_FK_payments    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_payments
    ADD CONSTRAINT "Users_FK_payments" FOREIGN KEY (user_id) REFERENCES public.users(user_id) NOT VALID;
 M   ALTER TABLE ONLY public.ticket_payments DROP CONSTRAINT "Users_FK_payments";
       public          postgres    false    203    208    3571            �           2606    26024 "   ticket_payments orders_FK_payments    FK CONSTRAINT     �   ALTER TABLE ONLY public.ticket_payments
    ADD CONSTRAINT "orders_FK_payments" FOREIGN KEY (order_id) REFERENCES public.ticket_orders(order_id) NOT VALID;
 N   ALTER TABLE ONLY public.ticket_payments DROP CONSTRAINT "orders_FK_payments";
       public          postgres    false    3574    206    208           