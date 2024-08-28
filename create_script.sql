--
-- PostgreSQL database dump
--

-- Dumped from database version 15.0
-- Dumped by pg_dump version 15.0

-- Started on 2024-08-27 22:19:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 868 (class 1247 OID 24672)
-- Name: estado_reparacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_reparacion AS ENUM (
    'pendiente',
    'en revision',
    'reparado',
    'sin arreglo',
    'no disponible',
    'abandonado'
);


--
-- TOC entry 225 (class 1259 OID 24933)
-- Name: cliente_id_sequence; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cliente_id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24597)
-- Name: cliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente (
    id integer DEFAULT nextval('public.cliente_id_sequence'::regclass) NOT NULL,
    nombre character varying(50),
    telefono character varying(12)
);


--
-- TOC entry 227 (class 1259 OID 24936)
-- Name: comentario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comentario (
    id integer NOT NULL,
    texto character varying(700) NOT NULL,
    id_reparacion integer NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 24935)
-- Name: comentario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comentario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 226
-- Name: comentario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comentario_id_seq OWNED BY public.comentario.id;


--
-- TOC entry 220 (class 1259 OID 24610)
-- Name: fabricante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fabricante (
    id integer NOT NULL,
    descripcion character varying(20) NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 24609)
-- Name: fabricante_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fabricante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 219
-- Name: fabricante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fabricante_id_seq OWNED BY public.fabricante.id;


--
-- TOC entry 222 (class 1259 OID 24634)
-- Name: factura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.factura (
    id integer NOT NULL,
    tipo character(1),
    fecha date NOT NULL,
    monto integer NOT NULL,
    medio_pago_id integer NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 24633)
-- Name: factura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 221
-- Name: factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.factura_id_seq OWNED BY public.factura.id;


--
-- TOC entry 215 (class 1259 OID 24591)
-- Name: medio_pago; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medio_pago (
    id integer NOT NULL,
    descripcion character varying(30) NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 24590)
-- Name: medio_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medio_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 214
-- Name: medio_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medio_pago_id_seq OWNED BY public.medio_pago.id;


--
-- TOC entry 224 (class 1259 OID 24646)
-- Name: reparacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reparacion (
    id integer NOT NULL,
    desc_falla character varying(140),
    fecha_recepcion date NOT NULL,
    id_cliente integer NOT NULL,
    factura_id integer,
    estado public.estado_reparacion NOT NULL,
    modelo_electro character varying(100) NOT NULL,
    tipo_electro_id integer,
    fabricante_id integer
);


--
-- TOC entry 223 (class 1259 OID 24645)
-- Name: reparacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reparacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 223
-- Name: reparacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reparacion_id_seq OWNED BY public.reparacion.id;


--
-- TOC entry 218 (class 1259 OID 24603)
-- Name: tipo_electro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_electro (
    id integer NOT NULL,
    descripcion character varying(30)
);


--
-- TOC entry 217 (class 1259 OID 24602)
-- Name: tipo_electro_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_electro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 217
-- Name: tipo_electro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_electro_id_seq OWNED BY public.tipo_electro.id;


--
-- TOC entry 3212 (class 2604 OID 24939)
-- Name: comentario id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comentario ALTER COLUMN id SET DEFAULT nextval('public.comentario_id_seq'::regclass);


--
-- TOC entry 3209 (class 2604 OID 24613)
-- Name: fabricante id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fabricante ALTER COLUMN id SET DEFAULT nextval('public.fabricante_id_seq'::regclass);


--
-- TOC entry 3210 (class 2604 OID 24637)
-- Name: factura id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura ALTER COLUMN id SET DEFAULT nextval('public.factura_id_seq'::regclass);


--
-- TOC entry 3206 (class 2604 OID 24594)
-- Name: medio_pago id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medio_pago ALTER COLUMN id SET DEFAULT nextval('public.medio_pago_id_seq'::regclass);


--
-- TOC entry 3211 (class 2604 OID 24649)
-- Name: reparacion id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reparacion ALTER COLUMN id SET DEFAULT nextval('public.reparacion_id_seq'::regclass);


--
-- TOC entry 3208 (class 2604 OID 24606)
-- Name: tipo_electro id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_electro ALTER COLUMN id SET DEFAULT nextval('public.tipo_electro_id_seq'::regclass);


--
-- TOC entry 3216 (class 2606 OID 24601)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- TOC entry 3226 (class 2606 OID 24943)
-- Name: comentario comentario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comentario
    ADD CONSTRAINT comentario_pkey PRIMARY KEY (id);


--
-- TOC entry 3220 (class 2606 OID 24615)
-- Name: fabricante fabricante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fabricante
    ADD CONSTRAINT fabricante_pkey PRIMARY KEY (id);


--
-- TOC entry 3222 (class 2606 OID 24639)
-- Name: factura factura_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_pkey PRIMARY KEY (id);


--
-- TOC entry 3214 (class 2606 OID 24596)
-- Name: medio_pago medio_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medio_pago
    ADD CONSTRAINT medio_pago_pkey PRIMARY KEY (id);


--
-- TOC entry 3224 (class 2606 OID 24651)
-- Name: reparacion reparacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reparacion
    ADD CONSTRAINT reparacion_pkey PRIMARY KEY (id);


--
-- TOC entry 3218 (class 2606 OID 24608)
-- Name: tipo_electro tipo_electro_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_electro
    ADD CONSTRAINT tipo_electro_pkey PRIMARY KEY (id);


--
-- TOC entry 3228 (class 2606 OID 24657)
-- Name: reparacion fk_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reparacion
    ADD CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id);


--
-- TOC entry 3232 (class 2606 OID 24944)
-- Name: comentario fk_comentario_reparacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comentario
    ADD CONSTRAINT fk_comentario_reparacion FOREIGN KEY (id_reparacion) REFERENCES public.reparacion(id);


--
-- TOC entry 3229 (class 2606 OID 24662)
-- Name: reparacion fk_factura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reparacion
    ADD CONSTRAINT fk_factura FOREIGN KEY (factura_id) REFERENCES public.factura(id);


--
-- TOC entry 3227 (class 2606 OID 24640)
-- Name: factura fk_medio_pago; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_medio_pago FOREIGN KEY (medio_pago_id) REFERENCES public.medio_pago(id);


--
-- TOC entry 3230 (class 2606 OID 24949)
-- Name: reparacion fk_reparacion_fabricante; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reparacion
    ADD CONSTRAINT fk_reparacion_fabricante FOREIGN KEY (fabricante_id) REFERENCES public.fabricante(id);


--
-- TOC entry 3231 (class 2606 OID 24954)
-- Name: reparacion fk_reparacion_tipo_electro; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reparacion
    ADD CONSTRAINT fk_reparacion_tipo_electro FOREIGN KEY (tipo_electro_id) REFERENCES public.tipo_electro(id);


-- Completed on 2024-08-27 22:19:16

--
-- PostgreSQL database dump complete
--

