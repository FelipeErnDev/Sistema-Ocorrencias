--
-- PostgreSQL database dump
--

\restrict bx11sNbq96NjJVdbZz19d4ZmFVJoJg6JUmdQsAPWW2ah86h6cnAbqJodlzLyzim

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-17 16:38:14 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16853)
-- Name: public; Type: SCHEMA; Schema: -; Owner: oc_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO oc_user;

--
-- TOC entry 852 (class 1247 OID 16855)
-- Name: subtarefas_status_enum; Type: TYPE; Schema: public; Owner: oc_user
--

CREATE TYPE public.subtarefas_status_enum AS ENUM (
    'em_atribuicao',
    'em_fila',
    'desenvolvimento',
    'aprovacao',
    'documentacao',
    'entregue'
);


ALTER TYPE public.subtarefas_status_enum OWNER TO oc_user;

--
-- TOC entry 855 (class 1247 OID 16868)
-- Name: users_perfil_enum; Type: TYPE; Schema: public; Owner: oc_user
--

CREATE TYPE public.users_perfil_enum AS ENUM (
    'ADMIN',
    'GESTOR',
    'COLABORADOR'
);


ALTER TYPE public.users_perfil_enum OWNER TO oc_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16875)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    "actorId" integer,
    "targetType" character varying NOT NULL,
    "targetId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    action character varying NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO oc_user;

--
-- TOC entry 215 (class 1259 OID 16881)
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO oc_user;

--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 215
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- TOC entry 216 (class 1259 OID 16882)
-- Name: historico_status; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.historico_status (
    id integer NOT NULL,
    "dataHora" timestamp without time zone DEFAULT now() NOT NULL,
    "ocorrenciaId" integer,
    "statusId" integer
);


ALTER TABLE public.historico_status OWNER TO oc_user;

--
-- TOC entry 217 (class 1259 OID 16886)
-- Name: historico_status_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.historico_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historico_status_id_seq OWNER TO oc_user;

--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 217
-- Name: historico_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.historico_status_id_seq OWNED BY public.historico_status.id;


--
-- TOC entry 218 (class 1259 OID 16887)
-- Name: ocorrencias; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.ocorrencias (
    id integer NOT NULL,
    titulo character varying NOT NULL,
    descricao text NOT NULL,
    "documentacaoUrl" character varying,
    "descricaoExecucao" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "gestorId" integer,
    "colaboradorId" integer NOT NULL,
    "setorId" integer,
    "statusId" integer,
    "workflowId" integer
);


ALTER TABLE public.ocorrencias OWNER TO oc_user;

--
-- TOC entry 219 (class 1259 OID 16894)
-- Name: ocorrencias_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.ocorrencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ocorrencias_id_seq OWNER TO oc_user;

--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 219
-- Name: ocorrencias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.ocorrencias_id_seq OWNED BY public.ocorrencias.id;


--
-- TOC entry 220 (class 1259 OID 16895)
-- Name: setores; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.setores (
    id integer NOT NULL,
    nome character varying NOT NULL
);


ALTER TABLE public.setores OWNER TO oc_user;

--
-- TOC entry 221 (class 1259 OID 16900)
-- Name: setores_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.setores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.setores_id_seq OWNER TO oc_user;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 221
-- Name: setores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.setores_id_seq OWNED BY public.setores.id;


--
-- TOC entry 222 (class 1259 OID 16901)
-- Name: status; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.status (
    id integer NOT NULL,
    chave character varying NOT NULL,
    nome character varying,
    ordem integer,
    "workflowId" integer
);


ALTER TABLE public.status OWNER TO oc_user;

--
-- TOC entry 223 (class 1259 OID 16906)
-- Name: status_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.status_id_seq OWNER TO oc_user;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 223
-- Name: status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;


--
-- TOC entry 224 (class 1259 OID 16907)
-- Name: subtarefas; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.subtarefas (
    id integer NOT NULL,
    titulo character varying NOT NULL,
    descricao text,
    status public.subtarefas_status_enum DEFAULT 'em_atribuicao'::public.subtarefas_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "ocorrenciaId" integer,
    "responsavelId" integer
);


ALTER TABLE public.subtarefas OWNER TO oc_user;

--
-- TOC entry 225 (class 1259 OID 16914)
-- Name: subtarefas_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.subtarefas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subtarefas_id_seq OWNER TO oc_user;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 225
-- Name: subtarefas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.subtarefas_id_seq OWNED BY public.subtarefas.id;


--
-- TOC entry 226 (class 1259 OID 16915)
-- Name: users; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nome character varying NOT NULL,
    email character varying NOT NULL,
    "senhaHash" character varying NOT NULL,
    perfil public.users_perfil_enum NOT NULL,
    "setorId" integer,
    peso double precision DEFAULT '1'::double precision NOT NULL
);


ALTER TABLE public.users OWNER TO oc_user;

--
-- TOC entry 227 (class 1259 OID 16921)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO oc_user;

--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 228 (class 1259 OID 16922)
-- Name: workflows; Type: TABLE; Schema: public; Owner: oc_user
--

CREATE TABLE public.workflows (
    id integer NOT NULL,
    nome character varying NOT NULL,
    descricao text
);


ALTER TABLE public.workflows OWNER TO oc_user;

--
-- TOC entry 229 (class 1259 OID 16927)
-- Name: workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: oc_user
--

CREATE SEQUENCE public.workflows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workflows_id_seq OWNER TO oc_user;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 229
-- Name: workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: oc_user
--

ALTER SEQUENCE public.workflows_id_seq OWNED BY public.workflows.id;


--
-- TOC entry 3304 (class 2604 OID 16928)
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- TOC entry 3306 (class 2604 OID 16929)
-- Name: historico_status id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.historico_status ALTER COLUMN id SET DEFAULT nextval('public.historico_status_id_seq'::regclass);


--
-- TOC entry 3308 (class 2604 OID 16930)
-- Name: ocorrencias id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.ocorrencias ALTER COLUMN id SET DEFAULT nextval('public.ocorrencias_id_seq'::regclass);


--
-- TOC entry 3311 (class 2604 OID 16931)
-- Name: setores id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.setores ALTER COLUMN id SET DEFAULT nextval('public.setores_id_seq'::regclass);


--
-- TOC entry 3312 (class 2604 OID 16932)
-- Name: status id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.status ALTER COLUMN id SET DEFAULT nextval('public.status_id_seq'::regclass);


--
-- TOC entry 3313 (class 2604 OID 16933)
-- Name: subtarefas id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.subtarefas ALTER COLUMN id SET DEFAULT nextval('public.subtarefas_id_seq'::regclass);


--
-- TOC entry 3316 (class 2604 OID 16934)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3318 (class 2604 OID 16935)
-- Name: workflows id; Type: DEFAULT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.workflows ALTER COLUMN id SET DEFAULT nextval('public.workflows_id_seq'::regclass);


--
-- TOC entry 3491 (class 0 OID 16875)
-- Dependencies: 214
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.audit_logs (id, "actorId", "targetType", "targetId", "createdAt", action) FROM stdin;
1	\N	ocorrencia	11	2025-10-22 12:29:48.737601	delete_ocorrencia
2	1	ocorrencia	10	2025-10-22 12:35:53.301825	delete_ocorrencia
3	\N	ocorrencia	1	2025-10-22 12:38:30.263323	update_ocorrencia_status
4	\N	ocorrencia	2	2025-10-22 12:38:44.144693	update_ocorrencia_atribuir
5	\N	ocorrencia	1	2025-10-22 12:41:21.448786	update_ocorrencia_status
6	\N	ocorrencia	2	2025-10-22 12:41:25.127836	update_ocorrencia_atribuir
7	\N	ocorrencia	1	2025-10-22 12:42:35.580755	update_ocorrencia_status
8	\N	ocorrencia	2	2025-10-22 12:42:37.864547	update_ocorrencia_atribuir
9	\N	ocorrencia	1	2025-10-22 12:44:02.327276	update_ocorrencia_status
10	\N	ocorrencia	2	2025-10-22 12:44:04.997132	update_ocorrencia_atribuir
11	1	ocorrencia	1	2025-10-22 12:47:30.338789	update_ocorrencia_status
12	1	ocorrencia	2	2025-10-22 12:47:36.702333	update_ocorrencia_atribuir
16	1	ocorrencia	5	2025-10-22 14:37:33.65868	transfer_ocorrencia
17	1	ocorrencia	6	2025-10-22 14:37:33.65868	transfer_ocorrencia
18	1	ocorrencia	9	2025-10-22 14:37:33.65868	transfer_ocorrencia
19	1	user	7	2025-10-22 14:37:33.65868	delete_user
32	1	subtarefa	0	2025-10-22 15:19:55.244034	transfer_subtarefa
33	1	ocorrencia	6	2025-10-22 15:19:55.244034	transfer_ocorrencia
34	1	ocorrencia	5	2025-10-22 15:19:55.244034	transfer_ocorrencia
35	1	ocorrencia	9	2025-10-22 15:19:55.244034	delete_ocorrencia
36	1	subtarefa	2	2025-10-22 15:19:55.244034	transfer_subtarefa
37	1	user	1	2025-10-22 15:19:55.244034	delete_user
42	1	subtarefa	2	2025-10-22 15:27:12.001362	delete_subtarefa
43	1	historico_status	7	2025-10-22 15:27:12.001362	delete_historico
44	1	ocorrencia	4	2025-10-22 15:27:12.001362	delete_ocorrencia
45	1	subtarefa	0	2025-10-22 15:27:12.001362	nullify_subtarefa_responsavel
46	1	user	2	2025-10-22 15:27:12.001362	delete_user
47	1	subtarefa	3	2025-10-22 15:43:04.68779	create_subtarefa
48	1	subtarefa	4	2025-10-22 15:43:50.340446	create_subtarefa
49	1	subtarefa	5	2025-10-22 15:54:24.76651	create_subtarefa
50	1	subtarefa	3	2025-10-22 16:03:27.372176	update_subtarefa
51	1	subtarefa	3	2025-10-22 16:05:01.142038	delete_subtarefa
52	\N	user	12	2025-10-23 09:42:21.721124	create_user
53	12	ocorrencia	1	2025-10-23 09:51:41.168591	update_ocorrencia_status
54	\N	user	14	2025-10-23 10:17:26.83382	create_user
55	\N	ocorrencia	13	2025-10-23 15:46:01.332852	create_ocorrencia
56	\N	ocorrencia	21	2025-10-23 16:23:14.697748	create_ocorrencia
57	\N	ocorrencia	22	2025-10-23 16:28:38.579911	create_ocorrencia
58	\N	ocorrencia	23	2025-10-23 16:29:10.28014	create_ocorrencia
59	\N	ocorrencia	24	2025-10-23 16:48:51.082912	create_ocorrencia
60	\N	ocorrencia	25	2025-10-23 16:59:43.098149	create_ocorrencia
61	\N	ocorrencia	26	2025-10-23 17:00:10.143604	create_ocorrencia
62	\N	ocorrencia	27	2025-10-23 18:24:01.190832	create_ocorrencia
63	15	subtarefa	7	2025-10-23 20:56:28.729364	create_subtarefa
64	15	subtarefa	8	2025-10-23 21:39:01.275639	create_subtarefa
65	15	subtarefa	9	2025-10-23 21:44:36.637859	create_subtarefa
66	\N	user	19	2025-10-24 13:01:02.34549	create_user
67	15	subtarefa	10	2025-10-24 15:21:53.023213	create_subtarefa
68	15	subtarefa	11	2025-10-24 15:28:35.367104	create_subtarefa
69	\N	user	20	2025-10-24 17:19:48.242571	create_user
70	15	ocorrencia	27	2025-10-24 17:25:37.850417	delete_ocorrencia
71	15	ocorrencia	26	2025-10-24 17:27:43.926394	delete_ocorrencia
72	\N	ocorrencia	26	2025-10-24 17:32:25.475156	create_ocorrencia
73	\N	ocorrencia	27	2025-10-24 17:33:21.093979	create_ocorrencia
74	15	ocorrencia	25	2025-10-24 17:34:08.722063	delete_ocorrencia
75	\N	ocorrencia	28	2025-10-24 17:35:14.015732	create_ocorrencia
76	15	ocorrencia	28	2025-10-24 17:37:49.335524	delete_ocorrencia
77	15	ocorrencia	27	2025-10-24 17:38:28.057618	delete_ocorrencia
78	\N	ocorrencia	29	2025-10-24 17:39:32.009099	create_ocorrencia
79	\N	ocorrencia	30	2025-10-24 17:39:43.23966	create_ocorrencia
80	15	ocorrencia	26	2025-10-24 17:40:24.6277	delete_ocorrencia
81	\N	user	21	2025-10-24 17:48:02.994029	create_user
82	\N	user	22	2025-10-24 17:54:39.75425	create_user
83	12	ocorrencia	30	2025-10-24 18:06:04.660798	delete_ocorrencia
84	\N	ocorrencia	31	2025-10-24 18:09:57.085899	create_ocorrencia
85	22	ocorrencia	31	2025-10-24 18:13:13.929497	delete_ocorrencia
86	15	ocorrencia	29	2025-10-24 18:17:27.478222	delete_ocorrencia
87	15	ocorrencia	24	2025-10-24 18:17:35.351535	delete_ocorrencia
88	15	ocorrencia	23	2025-10-24 18:20:54.447768	delete_ocorrencia
89	15	ocorrencia	22	2025-10-24 18:26:30.453052	delete_ocorrencia
90	15	ocorrencia	21	2025-10-24 18:35:46.44754	delete_ocorrencia
91	\N	user	23	2025-10-24 18:55:20.548464	create_user
92	\N	ocorrencia	32	2025-10-24 18:55:20.553242	create_ocorrencia
93	15	ocorrencia	32	2025-10-24 19:10:17.798395	update_ocorrencia
94	15	ocorrencia	32	2025-10-24 19:13:04.840662	update_ocorrencia
95	15	ocorrencia	32	2025-10-24 19:15:47.647805	delete_ocorrencia
96	\N	user	24	2025-10-24 19:27:36.871611	create_user
97	24	ocorrencia	13	2025-10-24 19:28:14.165432	delete_ocorrencia
98	24	ocorrencia	20	2025-10-24 19:28:19.402663	update_ocorrencia
99	\N	user	25	2025-10-24 20:31:13.780438	create_user
100	24	ocorrencia	20	2025-10-24 20:34:14.206977	delete_ocorrencia
101	25	ocorrencia	19	2025-10-24 20:35:10.176668	update_ocorrencia
102	24	ocorrencia	19	2025-10-24 20:36:51.072659	delete_ocorrencia
103	24	ocorrencia	18	2025-10-24 20:36:56.128216	delete_ocorrencia
104	25	ocorrencia	17	2025-10-24 20:37:24.263187	delete_ocorrencia
105	25	subtarefa	12	2025-10-24 20:37:31.007587	create_subtarefa
106	25	subtarefa	13	2025-10-24 20:37:32.86579	create_subtarefa
107	24	ocorrencia	16	2025-10-24 20:38:07.640527	delete_ocorrencia
108	25	ocorrencia	2	2025-10-24 20:39:33.810506	update_ocorrencia
109	25	ocorrencia	14	2025-10-24 20:39:45.590594	update_ocorrencia
110	24	ocorrencia	14	2025-10-24 20:41:11.519007	delete_ocorrencia
111	\N	ocorrencia	33	2025-10-27 17:12:14.304733	create_ocorrencia
112	24	ocorrencia	33	2025-10-27 20:52:01.696677	update_ocorrencia
113	24	ocorrencia	33	2025-10-27 20:52:02.157309	update_ocorrencia_status
114	24	ocorrencia	33	2025-10-27 20:55:38.258882	update_ocorrencia
115	24	ocorrencia	33	2025-10-27 20:55:56.041834	update_ocorrencia
116	24	ocorrencia	33	2025-10-27 20:55:56.475715	update_ocorrencia_atribuir
117	24	ocorrencia	33	2025-10-27 20:56:24.424518	update_ocorrencia
118	24	ocorrencia	33	2025-10-27 20:56:24.837244	update_ocorrencia_status
119	24	ocorrencia	33	2025-10-27 20:57:52.762368	update_ocorrencia
120	24	ocorrencia	33	2025-10-27 20:57:53.175395	update_ocorrencia_status
121	24	ocorrencia	33	2025-10-27 20:58:19.43335	update_ocorrencia
122	24	ocorrencia	33	2025-10-27 21:01:45.716073	update_ocorrencia
123	24	ocorrencia	33	2025-10-27 21:01:46.132091	update_ocorrencia_status
124	24	ocorrencia	33	2025-10-27 21:04:18.809627	update_ocorrencia
125	24	ocorrencia	33	2025-10-27 21:04:19.224627	update_ocorrencia_status
126	24	ocorrencia	33	2025-10-27 21:08:06.331275	update_ocorrencia
127	24	ocorrencia	33	2025-10-27 21:08:06.747976	update_ocorrencia_status
128	24	ocorrencia	33	2025-10-27 21:12:23.56935	update_ocorrencia_status
129	24	ocorrencia	33	2025-10-27 21:12:42.459053	update_ocorrencia_status
130	24	ocorrencia	33	2025-10-27 21:16:04.100416	update_ocorrencia
131	24	ocorrencia	33	2025-10-27 21:16:04.526225	update_ocorrencia
132	24	ocorrencia	33	2025-10-27 21:16:19.924501	update_ocorrencia
133	24	ocorrencia	33	2025-10-27 21:16:20.329707	update_ocorrencia
134	24	ocorrencia	33	2025-10-27 21:20:58.422842	update_ocorrencia_status
135	24	ocorrencia	33	2025-10-27 21:21:03.505998	update_ocorrencia_status
136	24	ocorrencia	33	2025-10-27 21:23:24.211979	update_ocorrencia_status
137	24	ocorrencia	33	2025-10-27 22:03:07.494239	update_ocorrencia_status
138	24	ocorrencia	33	2025-10-27 22:03:33.628274	update_ocorrencia
139	24	ocorrencia	33	2025-10-27 22:03:34.042213	update_ocorrencia_status
140	24	ocorrencia	33	2025-10-27 22:04:22.459261	update_ocorrencia_atribuir
141	24	ocorrencia	33	2025-10-27 22:24:07.462585	update_ocorrencia_status
142	\N	ocorrencia	34	2025-10-27 22:51:03.139677	create_ocorrencia
143	24	ocorrencia	34	2025-10-27 22:51:29.077913	update_ocorrencia_status
144	25	ocorrencia	34	2025-10-30 17:19:59.408578	update_ocorrencia_status
145	25	ocorrencia	15	2025-10-30 17:20:00.933285	update_ocorrencia_status
146	25	ocorrencia	34	2025-10-30 17:20:34.641166	update_ocorrencia_atribuir
147	25	ocorrencia	12	2025-10-30 17:21:18.108293	update_ocorrencia_status
148	25	ocorrencia	2	2025-10-30 17:21:19.45237	update_ocorrencia_status
149	25	ocorrencia	1	2025-10-30 17:21:21.250887	update_ocorrencia_status
150	25	ocorrencia	33	2025-10-30 17:21:43.835038	update_ocorrencia_status
151	25	ocorrencia	15	2025-10-30 17:21:45.372509	update_ocorrencia_status
152	25	ocorrencia	2	2025-10-30 17:21:47.606167	update_ocorrencia_status
153	25	ocorrencia	12	2025-10-30 17:21:48.851411	update_ocorrencia_status
154	25	ocorrencia	1	2025-10-30 17:21:50.164337	update_ocorrencia_status
155	25	ocorrencia	1	2025-10-30 17:21:54.228935	update_ocorrencia_status
156	25	ocorrencia	2	2025-10-30 17:22:08.590128	update_ocorrencia_atribuir
157	\N	ocorrencia	35	2025-10-30 17:22:43.906888	create_ocorrencia
158	25	ocorrencia	35	2025-10-30 17:23:00.197301	update_ocorrencia_status
159	25	ocorrencia	35	2025-10-30 17:23:02.219011	update_ocorrencia_status
160	25	ocorrencia	35	2025-10-30 17:23:04.197979	update_ocorrencia_status
161	25	ocorrencia	35	2025-10-30 17:23:15.815729	update_ocorrencia_status
162	25	ocorrencia	35	2025-10-30 17:23:36.951479	update_ocorrencia
163	25	ocorrencia	35	2025-10-30 17:23:37.265606	update_ocorrencia_status
164	25	ocorrencia	15	2025-10-30 17:24:08.660278	update_ocorrencia
165	25	ocorrencia	15	2025-10-30 17:24:08.976595	update_ocorrencia_status
166	25	ocorrencia	15	2025-10-30 17:24:22.325098	update_ocorrencia_status
167	25	ocorrencia	15	2025-10-30 17:24:24.023441	update_ocorrencia_status
168	25	ocorrencia	2	2025-10-30 17:27:04.341771	update_ocorrencia_status
169	15	ocorrencia	33	2025-10-30 17:40:49.073912	update_ocorrencia_status
170	\N	user	26	2025-10-30 17:50:48.529741	create_user
171	\N	ocorrencia	36	2025-10-30 18:02:22.045774	create_ocorrencia
172	26	subtarefa	14	2025-10-30 18:03:10.442124	create_subtarefa
173	26	ocorrencia	36	2025-10-30 18:29:52.624781	update_ocorrencia_status
174	26	ocorrencia	36	2025-10-30 18:29:58.507927	update_ocorrencia_status
175	15	ocorrencia	36	2025-10-30 22:47:16.533369	update_ocorrencia_atribuir
176	15	ocorrencia	36	2025-10-30 22:47:23.503071	update_ocorrencia_atribuir
177	15	ocorrencia	36	2025-10-30 22:47:29.723709	update_ocorrencia_atribuir
178	15	subtarefa	15	2025-10-30 22:54:31.63257	create_subtarefa
179	15	ocorrencia	36	2025-10-30 22:56:15.137971	update_ocorrencia_atribuir
180	15	ocorrencia	15	2025-10-31 16:34:07.361994	update_ocorrencia_status
181	15	ocorrencia	12	2025-10-31 16:34:15.878974	update_ocorrencia_status
182	15	ocorrencia	35	2025-10-31 16:35:20.912019	update_ocorrencia_status
183	15	ocorrencia	33	2025-10-31 16:35:25.342934	update_ocorrencia_status
184	15	ocorrencia	12	2025-10-31 16:35:29.017498	update_ocorrencia_status
185	15	ocorrencia	35	2025-10-31 16:35:39.455153	update_ocorrencia_status
186	15	ocorrencia	35	2025-10-31 16:36:12.495634	update_ocorrencia_status
187	15	ocorrencia	1	2025-10-31 16:36:22.575955	update_ocorrencia_status
188	15	ocorrencia	2	2025-10-31 16:38:38.847275	update_ocorrencia_status
189	15	ocorrencia	2	2025-10-31 16:38:44.545685	update_ocorrencia_status
190	15	ocorrencia	36	2025-10-31 16:40:50.295106	update_ocorrencia_status
191	15	ocorrencia	34	2025-10-31 16:40:54.499245	update_ocorrencia_status
192	15	ocorrencia	35	2025-10-31 16:40:56.16049	update_ocorrencia_status
193	15	ocorrencia	34	2025-10-31 16:40:58.90688	update_ocorrencia_status
194	15	ocorrencia	35	2025-10-31 16:41:00.836827	update_ocorrencia_status
195	\N	ocorrencia	37	2025-10-31 16:46:24.291876	create_ocorrencia
196	15	ocorrencia	36	2025-10-31 16:46:31.061056	update_ocorrencia_status
197	15	ocorrencia	34	2025-10-31 16:46:45.70587	update_ocorrencia_status
198	15	ocorrencia	36	2025-10-31 16:51:02.319467	update_ocorrencia_status
199	\N	ocorrencia	38	2025-10-31 16:51:38.255555	create_ocorrencia
200	\N	ocorrencia	39	2025-10-31 16:52:01.563548	create_ocorrencia
201	\N	ocorrencia	40	2025-10-31 16:52:29.686246	create_ocorrencia
202	\N	ocorrencia	41	2025-10-31 16:52:52.960339	create_ocorrencia
203	15	ocorrencia	36	2025-10-31 16:53:43.830177	update_ocorrencia_status
204	15	ocorrencia	35	2025-10-31 16:55:00.414649	update_ocorrencia_status
205	15	ocorrencia	35	2025-10-31 16:55:05.991	update_ocorrencia_status
206	15	ocorrencia	12	2025-10-31 17:14:38.04522	update_ocorrencia_status
207	15	ocorrencia	15	2025-10-31 17:14:39.487259	update_ocorrencia_status
208	15	ocorrencia	15	2025-10-31 17:16:29.618298	update_ocorrencia_status
209	15	ocorrencia	15	2025-10-31 17:16:33.253735	update_ocorrencia_status
210	15	ocorrencia	12	2025-10-31 17:23:40.572455	update_ocorrencia_status
211	15	ocorrencia	36	2025-10-31 17:23:41.441482	update_ocorrencia_status
212	15	ocorrencia	15	2025-10-31 17:23:42.012428	update_ocorrencia_status
213	15	ocorrencia	1	2025-10-31 17:23:43.55755	update_ocorrencia_status
214	15	ocorrencia	12	2025-10-31 17:23:46.425316	update_ocorrencia_status
215	\N	ocorrencia	42	2025-10-31 17:32:13.31892	create_ocorrencia
216	\N	ocorrencia	43	2025-10-31 17:32:13.678906	create_ocorrencia
217	15	ocorrencia	42	2025-10-31 18:11:43.041988	update_ocorrencia_status
218	15	ocorrencia	36	2025-10-31 18:12:03.248669	update_ocorrencia_status
219	15	ocorrencia	43	2025-10-31 18:15:11.494889	delete_ocorrencia
220	15	ocorrencia	42	2025-10-31 18:15:25.913271	delete_ocorrencia
221	15	ocorrencia	41	2025-10-31 18:15:55.048271	update_ocorrencia_atribuir
222	15	ocorrencia	41	2025-10-31 18:31:06.198536	update_ocorrencia_atribuir
223	15	ocorrencia	41	2025-10-31 18:31:16.271931	update_ocorrencia_atribuir
224	15	ocorrencia	41	2025-10-31 18:31:24.629465	update_ocorrencia_atribuir
225	15	ocorrencia	41	2025-10-31 18:31:52.683048	update_ocorrencia_atribuir
226	15	ocorrencia	35	2025-10-31 18:33:04.548293	update_ocorrencia_atribuir
227	15	ocorrencia	33	2025-10-31 18:33:32.581377	update_ocorrencia_atribuir
228	15	subtarefa	16	2025-10-31 18:34:19.913254	create_subtarefa
229	15	subtarefa	17	2025-10-31 18:41:50.912982	create_subtarefa
230	15	subtarefa	18	2025-10-31 18:44:15.167098	create_subtarefa
231	15	ocorrencia	15	2025-10-31 18:45:46.097527	update_ocorrencia_status
232	15	ocorrencia	40	2025-10-31 18:45:47.67232	update_ocorrencia_status
233	15	subtarefa	19	2025-10-31 18:47:31.874634	create_subtarefa
234	15	subtarefa	20	2025-10-31 18:47:35.69702	create_subtarefa
235	15	subtarefa	21	2025-10-31 19:12:32.745194	create_subtarefa
236	15	subtarefa	22	2025-10-31 19:12:39.116194	create_subtarefa
237	15	subtarefa	23	2025-10-31 19:13:17.940705	create_subtarefa
238	15	subtarefa	24	2025-10-31 19:13:31.492656	create_subtarefa
239	15	subtarefa	25	2025-10-31 19:18:07.999245	create_subtarefa
240	15	subtarefa	26	2025-10-31 19:18:15.905055	create_subtarefa
241	15	subtarefa	19	2025-10-31 19:44:42.516059	delete_subtarefa
242	15	subtarefa	22	2025-10-31 19:44:59.510498	delete_subtarefa
243	15	subtarefa	20	2025-10-31 19:45:07.774266	delete_subtarefa
244	15	subtarefa	17	2025-10-31 19:46:00.763468	delete_subtarefa
245	15	subtarefa	26	2025-10-31 19:46:11.886451	delete_subtarefa
246	15	subtarefa	24	2025-10-31 19:46:14.135136	delete_subtarefa
247	15	subtarefa	23	2025-10-31 19:46:15.741604	delete_subtarefa
248	15	subtarefa	21	2025-10-31 19:46:17.725108	delete_subtarefa
249	15	subtarefa	16	2025-10-31 19:46:19.34605	delete_subtarefa
250	15	subtarefa	18	2025-10-31 19:46:26.428998	delete_subtarefa
251	15	status	8	2025-11-07 00:13:23.635949	update_status
252	15	status	9	2025-11-07 00:13:24.088238	update_status
253	15	status	10	2025-11-07 00:13:24.864064	update_status
254	15	status	11	2025-11-07 00:13:25.375915	update_status
255	15	status	13	2025-11-07 00:13:26.16537	update_status
256	15	status	14	2025-11-07 00:13:26.637977	update_status
257	15	status	16	2025-11-07 00:13:27.37997	update_status
258	15	status	17	2025-11-07 00:13:27.821397	update_status
259	15	ocorrencia	17	2025-11-07 22:11:15.815944	update_ocorrencia
260	15	ocorrencia	17	2025-11-07 22:11:16.273553	update_ocorrencia_atribuir
261	15	ocorrencia	17	2025-11-07 22:23:48.672667	update_ocorrencia
262	15	ocorrencia	17	2025-11-07 22:30:52.297699	delete_ocorrencia
263	15	ocorrencia	16	2025-11-07 22:36:56.42942	update_ocorrencia
264	15	ocorrencia	16	2025-11-07 22:37:36.916565	update_ocorrencia
265	15	ocorrencia	16	2025-11-07 22:42:46.552885	update_ocorrencia
266	\N	ocorrencia	18	2025-11-07 22:53:56.571534	create_ocorrencia
267	\N	ocorrencia	19	2025-11-07 22:54:26.464876	create_ocorrencia
268	15	ocorrencia	19	2025-11-07 23:03:06.138144	update_ocorrencia
269	15	ocorrencia	19	2025-11-07 23:03:11.810617	update_ocorrencia
270	15	ocorrencia	19	2025-11-07 23:04:00.397034	update_ocorrencia
271	15	ocorrencia	19	2025-11-07 23:05:04.189706	update_ocorrencia
272	15	ocorrencia	19	2025-11-07 23:12:06.051696	update_ocorrencia
273	15	ocorrencia	19	2025-11-07 23:12:35.528325	update_ocorrencia
274	15	status	1	2025-11-07 23:17:03.297824	update_status
275	15	status	2	2025-11-07 23:17:03.771734	update_status
276	15	status	3	2025-11-07 23:17:04.197612	update_status
277	15	status	4	2025-11-07 23:17:04.743005	update_status
278	15	ocorrencia	19	2025-11-07 23:17:08.068435	update_ocorrencia_status
279	15	status	17	2025-11-07 23:17:49.811662	delete_status
280	15	status	16	2025-11-07 23:17:55.110156	delete_status
281	15	status	18	2025-11-07 23:19:43.097372	create_status
282	15	ocorrencia	19	2025-11-07 23:24:11.718977	update_ocorrencia
283	15	ocorrencia	19	2025-11-07 23:24:19.051994	update_ocorrencia
284	15	ocorrencia	19	2025-11-07 23:24:57.747068	delete_ocorrencia
285	15	ocorrencia	18	2025-11-07 23:39:15.157088	update_ocorrencia_status
286	15	ocorrencia	18	2025-11-10 21:37:01.665673	update_ocorrencia
287	15	ocorrencia	18	2025-11-10 21:37:12.193623	update_ocorrencia
288	15	user	5	2025-11-11 23:27:16.646424	delete_user
289	15	user	2	2025-11-11 23:27:48.019731	delete_user
290	15	user	27	2025-11-11 23:34:05.048948	create_user
291	15	user	6	2025-11-12 00:28:18.060609	update_user_peso
292	15	user	6	2025-11-12 00:35:17.097807	update_user_peso
293	15	user	6	2025-11-12 00:35:24.721098	update_user_peso
294	15	user	7	2025-11-12 00:35:37.249655	update_user_peso
295	15	user	7	2025-11-12 00:35:46.797441	update_user_peso
296	15	user	28	2025-11-12 00:36:49.354842	create_user
297	15	subtarefa	0	2025-11-12 00:42:57.905451	delete_subtarefa
298	15	historico_status	6	2025-11-12 00:42:57.905451	delete_historico
299	15	ocorrencia	1	2025-11-12 00:42:57.905451	delete_ocorrencia
300	15	subtarefa	0	2025-11-12 00:42:57.905451	nullify_subtarefa_responsavel
301	15	user	8	2025-11-12 00:42:57.905451	delete_user
302	15	subtarefa	0	2025-11-12 00:43:07.195217	delete_subtarefa
303	15	historico_status	12	2025-11-12 00:43:07.195217	delete_historico
304	15	ocorrencia	1	2025-11-12 00:43:07.195217	delete_ocorrencia
305	15	subtarefa	0	2025-11-12 00:43:07.195217	nullify_subtarefa_responsavel
306	15	user	7	2025-11-12 00:43:07.195217	delete_user
307	15	user	9	2025-11-12 00:50:49.676763	update_user_peso
308	15	user	9	2025-11-12 00:51:11.223285	update_user_peso
309	15	ocorrencia	18	2025-11-12 00:58:03.807273	update_ocorrencia
310	15	ocorrencia	18	2025-11-12 00:58:13.483162	update_ocorrencia
311	15	status	1	2025-11-12 01:00:46.088989	update_status
312	15	status	3	2025-11-12 01:00:46.523588	update_status
313	15	status	2	2025-11-12 01:00:47.257366	update_status
314	15	status	1	2025-11-12 01:00:51.62867	update_status
315	15	status	2	2025-11-12 01:00:52.061542	update_status
316	15	status	3	2025-11-12 01:00:52.808843	update_status
317	15	status	4	2025-11-12 01:00:53.230442	update_status
318	15	status	5	2025-11-12 01:00:54.049457	update_status
319	15	status	6	2025-11-12 01:00:54.472531	update_status
320	15	status	7	2025-11-12 01:00:55.196458	update_status
321	15	status	8	2025-11-12 01:00:55.630231	update_status
322	15	status	9	2025-11-12 01:00:56.373023	update_status
323	15	status	10	2025-11-12 01:00:57.107801	update_status
324	15	status	11	2025-11-12 01:00:57.848031	update_status
325	15	status	13	2025-11-12 01:00:58.575367	update_status
326	15	status	14	2025-11-12 01:00:59.322345	update_status
327	15	status	18	2025-11-12 01:01:00.054586	update_status
328	15	ocorrencia	18	2025-11-12 01:03:02.022134	update_ocorrencia_atribuir
329	15	subtarefa	18	2025-11-12 01:36:47.985632	create_subtarefa
330	15	ocorrencia	18	2025-11-12 01:36:55.173079	update_ocorrencia_status
331	15	ocorrencia	18	2025-11-12 01:36:56.926695	update_ocorrencia_status
332	15	subtarefa	19	2025-11-12 01:37:10.931076	create_subtarefa
333	15	subtarefa	19	2025-11-12 01:37:27.846485	delete_subtarefa
334	15	subtarefa	20	2025-11-12 01:38:33.641289	create_subtarefa
335	15	subtarefa	20	2025-11-12 01:38:56.95504	delete_subtarefa
336	15	subtarefa	21	2025-11-12 01:43:22.164339	create_subtarefa
337	15	subtarefa	21	2025-11-12 01:52:20.607747	delete_subtarefa
338	15	subtarefa	18	2025-11-12 01:52:37.076146	delete_subtarefa
339	15	subtarefa	22	2025-11-12 01:54:45.942423	create_subtarefa
340	15	ocorrencia	18	2025-11-12 01:55:40.432684	update_ocorrencia_status
341	15	subtarefa	23	2025-11-12 01:55:53.453518	create_subtarefa
342	15	subtarefa	23	2025-11-12 01:56:14.446135	delete_subtarefa
343	15	subtarefa	22	2025-11-12 01:56:56.574	delete_subtarefa
344	15	subtarefa	24	2025-11-12 01:57:04.375979	create_subtarefa
345	15	subtarefa	24	2025-11-12 02:02:43.278038	delete_subtarefa
346	15	subtarefa	25	2025-11-12 02:02:55.128163	create_subtarefa
347	15	subtarefa	26	2025-11-12 02:10:56.965671	create_subtarefa
348	15	subtarefa	25	2025-11-12 02:11:56.148899	delete_subtarefa
349	15	subtarefa	27	2025-11-12 02:12:05.941241	create_subtarefa
350	15	subtarefa	27	2025-11-12 02:12:44.213416	delete_subtarefa
351	15	subtarefa	28	2025-11-12 02:17:49.265308	create_subtarefa
352	15	subtarefa	29	2025-11-12 02:28:37.00904	create_subtarefa
353	15	subtarefa	26	2025-11-12 02:28:55.000069	delete_subtarefa
354	15	subtarefa	30	2025-11-12 02:28:59.060216	create_subtarefa
355	15	subtarefa	31	2025-11-12 02:29:02.300726	create_subtarefa
356	15	subtarefa	32	2025-11-12 02:29:09.537214	create_subtarefa
357	15	subtarefa	32	2025-11-12 02:29:14.399096	update_subtarefa
358	15	subtarefa	28	2025-11-12 02:32:37.773752	delete_subtarefa
359	15	subtarefa	33	2025-11-12 02:32:41.776201	create_subtarefa
360	15	subtarefa	29	2025-11-12 02:35:34.457201	delete_subtarefa
361	15	subtarefa	34	2025-11-12 02:38:15.331221	create_subtarefa
362	15	subtarefa	34	2025-11-12 02:38:20.820731	delete_subtarefa
363	15	subtarefa	35	2025-11-12 02:38:26.710036	create_subtarefa
364	15	ocorrencia	34	2025-11-12 02:38:35.584618	update_ocorrencia_status
365	15	ocorrencia	34	2025-11-12 02:38:44.768751	update_ocorrencia_atribuir
366	15	ocorrencia	34	2025-11-12 02:38:52.27551	update_ocorrencia_atribuir
367	15	ocorrencia	34	2025-11-12 02:38:57.662585	update_ocorrencia_atribuir
368	15	status	1	2025-11-12 02:39:04.523355	update_status
369	15	status	3	2025-11-12 02:39:05.260007	update_status
370	15	status	1	2025-11-12 02:39:11.70267	update_status
371	15	status	3	2025-11-12 02:39:12.447272	update_status
372	15	status	2	2025-11-12 02:39:12.882263	update_status
373	15	status	4	2025-11-12 02:39:13.612551	update_status
374	15	status	1	2025-11-12 02:39:17.700763	update_status
375	15	status	2	2025-11-12 02:39:18.449281	update_status
376	15	status	3	2025-11-12 02:39:19.87305	update_status
377	15	ocorrencia	16	2025-11-12 02:39:23.841861	update_ocorrencia_status
378	15	subtarefa	32	2025-11-12 22:44:28.255179	update_subtarefa
379	15	subtarefa	32	2025-11-12 22:45:30.339344	delete_subtarefa
380	15	status	9	2025-11-12 22:46:02.045159	delete_status
381	15	status	18	2025-11-12 22:46:11.20138	delete_status
382	15	status	19	2025-11-12 22:46:24.347349	create_status
383	15	setor	2	2025-11-12 23:24:25.136783	update_setor
384	15	setor	5	2025-11-12 23:25:21.124405	create_setor
385	15	setor	6	2025-11-12 23:25:26.08383	create_setor
386	15	setor	7	2025-11-12 23:25:32.643819	create_setor
387	15	ocorrencia	16	2025-11-12 23:58:34.558098	update_ocorrencia_status
388	\N	ocorrencia	20	2025-11-17 17:25:08.93006	create_ocorrencia
389	\N	ocorrencia	21	2025-11-17 17:29:02.222189	create_ocorrencia
390	\N	user	29	2025-11-17 18:51:23.778092	create_user
391	\N	ocorrencia	22	2025-11-17 18:54:02.701546	create_ocorrencia
392	\N	ocorrencia	23	2025-11-17 18:54:14.824804	create_ocorrencia
393	\N	ocorrencia	24	2025-11-17 18:54:28.493234	create_ocorrencia
394	\N	ocorrencia	25	2025-11-17 18:56:25.987627	create_ocorrencia
395	\N	ocorrencia	26	2025-11-17 18:58:47.595542	create_ocorrencia
396	\N	ocorrencia	27	2025-11-17 18:59:15.85588	create_ocorrencia
\.


--
-- TOC entry 3493 (class 0 OID 16882)
-- Dependencies: 216
-- Data for Name: historico_status; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.historico_status (id, "dataHora", "ocorrenciaId", "statusId") FROM stdin;
1	2025-10-21 11:46:36.468991	2	\N
189	2025-11-12 01:03:02.014133	18	2
193	2025-11-12 02:38:35.570436	34	5
194	2025-11-12 02:38:44.762282	34	2
195	2025-11-12 02:38:52.26528	34	2
196	2025-11-12 02:38:57.656765	34	2
198	2025-11-12 23:58:34.548242	16	4
25	2025-10-27 17:12:14.29261	33	2
26	2025-10-27 20:52:02.148698	33	1
27	2025-10-27 20:55:56.469102	33	2
28	2025-10-27 20:56:24.829368	33	1
29	2025-10-27 20:57:53.167703	33	1
30	2025-10-27 21:01:46.125472	33	1
31	2025-10-27 21:04:19.218073	33	1
32	2025-10-27 21:08:06.737196	33	1
33	2025-10-27 21:12:23.56324	33	1
34	2025-10-27 21:12:42.451796	33	1
35	2025-10-27 21:20:58.402396	33	1
36	2025-10-27 21:21:03.4991	33	1
37	2025-10-27 21:23:24.20519	33	1
38	2025-10-27 22:03:07.480456	33	1
39	2025-10-27 22:03:34.035837	33	1
40	2025-10-27 22:04:22.448835	33	2
41	2025-10-27 22:24:07.454323	33	1
42	2025-10-27 22:51:03.129547	34	2
43	2025-10-27 22:51:29.071129	34	1
44	2025-10-30 17:19:59.377452	34	1
46	2025-10-30 17:20:34.631312	34	2
47	2025-10-30 17:21:18.101403	12	1
48	2025-10-30 17:21:19.443753	2	1
50	2025-10-30 17:21:43.827114	33	1
52	2025-10-30 17:21:47.579933	2	1
53	2025-10-30 17:21:48.842744	12	1
56	2025-10-30 17:22:08.582988	2	2
57	2025-10-30 17:22:43.893211	35	2
58	2025-10-30 17:23:00.18095	35	1
59	2025-10-30 17:23:02.212387	35	1
60	2025-10-30 17:23:04.185359	35	1
61	2025-10-30 17:23:15.807058	35	1
62	2025-10-30 17:23:37.257782	35	1
66	2025-10-30 17:27:04.324075	2	1
67	2025-10-30 17:40:49.061821	33	1
68	2025-10-30 18:02:22.03461	36	2
69	2025-10-30 18:29:52.61766	36	1
70	2025-10-30 18:29:58.499416	36	1
71	2025-10-30 22:47:16.524511	36	2
72	2025-10-30 22:47:23.494709	36	2
73	2025-10-30 22:47:29.71416	36	2
74	2025-10-30 22:56:15.128302	36	2
76	2025-10-31 16:34:15.872586	12	1
77	2025-10-31 16:35:20.902995	35	1
78	2025-10-31 16:35:25.334549	33	1
79	2025-10-31 16:35:29.006911	12	1
80	2025-10-31 16:35:39.448108	35	1
81	2025-10-31 16:36:12.486779	35	1
83	2025-10-31 16:38:38.839027	2	1
84	2025-10-31 16:38:44.535391	2	1
85	2025-10-31 16:40:50.289279	36	1
86	2025-10-31 16:40:54.490063	34	1
87	2025-10-31 16:40:56.151735	35	1
88	2025-10-31 16:40:58.89858	34	1
89	2025-10-31 16:41:00.829087	35	1
90	2025-10-31 16:46:24.284907	37	2
91	2025-10-31 16:46:31.054024	36	1
92	2025-10-31 16:46:45.692632	34	1
93	2025-10-31 16:51:02.312299	36	1
94	2025-10-31 16:51:38.247776	38	2
95	2025-10-31 16:52:01.556366	39	2
97	2025-10-31 16:52:52.952946	41	2
98	2025-10-31 16:53:43.822819	36	1
99	2025-10-31 16:55:00.404033	35	1
100	2025-10-31 16:55:05.974071	35	1
101	2025-10-31 17:14:38.037917	12	1
105	2025-10-31 17:23:40.554857	12	1
106	2025-10-31 17:23:41.434024	36	1
109	2025-10-31 17:23:46.418851	12	1
113	2025-10-31 18:12:03.238243	36	1
114	2025-10-31 18:15:55.039842	41	2
115	2025-10-31 18:31:06.190576	41	2
116	2025-10-31 18:31:16.264731	41	2
117	2025-10-31 18:31:24.617213	41	2
118	2025-10-31 18:31:52.67414	41	2
119	2025-10-31 18:33:04.540808	35	2
120	2025-10-31 18:33:32.574537	33	2
19	2025-11-01 17:20:13.88454	41	1
20	2025-11-01 19:59:37.067216	38	1
21	2025-11-01 20:06:18.95997	41	1
22	2025-11-01 20:06:24.851937	41	1
23	2025-11-01 20:06:31.184369	39	1
24	2025-11-01 20:06:39.320649	41	1
96	2025-11-05 21:05:59.247609	41	1
110	2025-11-05 21:06:29.26625	41	1
190	2025-11-12 01:36:55.167885	18	4
191	2025-11-12 01:36:56.919681	18	1
197	2025-11-12 02:39:23.835672	16	3
111	2025-11-05 21:06:38.169033	41	2
112	2025-11-05 21:06:54.52605	39	3
192	2025-11-12 01:55:40.426472	18	7
122	2025-11-05 21:07:18.709019	38	1
123	2025-11-05 21:07:23.697346	38	3
124	2025-11-05 21:07:26.861132	38	4
125	2025-11-05 21:07:31.903007	38	5
126	2025-11-05 21:08:26.041464	38	8
127	2025-11-05 21:08:45.978454	36	2
128	2025-11-05 21:11:00.614548	41	3
129	2025-11-05 21:35:16.019721	38	7
130	2025-11-05 21:37:47.656437	39	2
131	2025-11-05 21:49:59.75167	41	4
132	2025-11-05 21:51:59.52422	39	3
133	2025-11-05 22:00:54.977183	36	3
134	2025-11-05 22:01:03.311061	41	2
135	2025-11-05 22:01:11.183934	37	2
136	2025-11-05 22:05:09.132825	39	4
137	2025-11-05 22:09:09.950734	35	3
138	2025-11-05 22:09:11.475126	39	5
139	2025-11-05 22:09:14.648639	36	2
140	2025-11-05 22:09:16.58049	37	3
141	2025-11-05 22:09:18.661986	39	6
142	2025-11-05 22:10:55.97417	41	2
143	2025-11-05 22:12:59.745526	37	4
144	2025-11-05 22:13:01.435781	41	3
145	2025-11-05 22:13:06.302923	34	1
146	2025-11-05 22:13:08.810901	37	5
147	2025-11-05 22:19:11.035433	36	3
148	2025-11-05 22:19:13.322089	36	2
149	2025-11-05 22:45:09.72835	36	3
150	2025-11-05 22:52:31.236449	34	2
151	2025-11-05 22:56:21.11716	34	3
152	2025-11-05 22:56:59.254287	41	2
153	2025-11-05 22:57:06.644481	36	2
154	2025-11-05 23:06:25.455492	14	2
155	2025-11-05 23:07:05.714283	16	2
156	2025-11-05 23:31:08.365844	35	4
157	2025-11-05 23:31:18.900523	35	3
158	2025-11-05 23:32:46.316677	16	3
159	2025-11-05 23:38:00.383256	39	8
160	2025-11-05 23:38:07.37515	38	8
161	2025-11-05 23:38:14.557565	39	8
162	2025-11-05 23:38:15.955596	41	8
163	2025-11-05 23:38:17.730249	14	8
164	2025-11-05 23:38:48.405844	16	3
165	2025-11-05 23:38:49.697982	41	3
166	2025-11-05 23:38:52.849847	14	3
167	2025-11-05 23:39:04.330797	14	2
168	2025-11-05 23:49:48.409501	16	2
169	2025-11-05 23:52:01.751419	33	2
171	2025-11-06 00:04:25.485793	41	4
172	2025-11-06 00:04:58.103768	41	3
173	2025-11-06 00:05:25.796435	34	4
174	2025-11-06 00:05:51.651456	34	3
175	2025-11-06 13:00:46.923568	41	4
176	2025-11-06 13:00:48.933396	41	3
177	2025-11-06 13:57:33.370288	41	2
178	2025-11-06 21:20:50.738126	35	4
179	2025-11-06 21:20:54.613383	35	14
180	2025-11-06 21:21:00.518799	35	13
181	2025-11-06 21:21:03.51417	35	14
182	2025-11-06 21:58:33.495854	34	4
185	2025-11-07 22:53:56.564277	18	2
188	2025-11-07 23:39:15.151585	18	3
199	2025-11-17 17:25:08.922066	20	2
200	2025-11-17 17:29:02.213861	21	2
201	2025-11-17 18:54:02.696272	22	2
202	2025-11-17 18:54:14.817654	23	2
203	2025-11-17 18:54:28.486924	24	2
204	2025-11-17 18:56:25.976364	25	2
205	2025-11-17 18:58:47.589716	26	2
206	2025-11-17 18:59:15.849023	27	2
\.


--
-- TOC entry 3495 (class 0 OID 16887)
-- Dependencies: 218
-- Data for Name: ocorrencias; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.ocorrencias (id, titulo, descricao, "documentacaoUrl", "descricaoExecucao", "createdAt", "updatedAt", "gestorId", "colaboradorId", "setorId", "statusId", "workflowId") FROM stdin;
18	teste21	teste21w	\N	\N	2025-11-07 22:53:56.554579	2025-11-12 01:55:40.417958	17	25	2	7	\N
34	Teste 	Testando novo fluxo	\N	\N	2025-10-27 22:51:03.11523	2025-11-12 02:38:57.646507	6	6	1	2	3
16	teste criee 2	teste criee	\N	\N	2025-11-05 23:07:05.706794	2025-11-12 23:58:34.540727	6	17	1	4	3
39	berbrevbew	 r breewvvewvew	\N	\N	2025-10-31 16:52:01.549239	2025-11-05 23:38:00.375768	6	18	1	8	3
38	wbrebre	rebrebre	\N	\N	2025-10-31 16:51:38.238414	2025-11-05 23:38:07.369362	6	22	1	8	3
14	teste cri	teste cri	\N	\N	2025-11-05 23:06:25.44921	2025-11-05 23:39:04.322171	6	16	1	2	3
33	Teste 1	Testwe	\N	\N	2025-10-27 17:12:14.266745	2025-11-05 23:52:01.743075	6	16	3	2	3
41	erbreb S FSE	rerbebre	\N	\N	2025-10-31 16:52:52.945482	2025-11-06 13:57:33.34123	6	18	1	2	3
2	Título da ocorrência	Descrição detalhada	\N	\N	2025-10-21 11:36:59.922653	2025-10-30 17:27:04.311559	6	19	1	1	3
35	Teste	teste	\N	\N	2025-10-30 17:22:43.879656	2025-11-06 21:21:03.507992	6	19	1	14	3
37	rgwgw	gg43g43	\N	\N	2025-10-31 16:46:24.271631	2025-11-05 22:13:08.804457	6	19	1	5	3
36	Teste felipe	Teste felipe Teste felipe Teste felipe Teste felipe	\N	\N	2025-10-30 18:02:22.012878	2025-11-05 22:57:06.622975	17	14	2	2	3
12	Teste	Teste	\N	\N	2025-10-22 14:53:50.68474	2025-10-30 17:21:18.093545	6	12	1	1	7
20	aaa na página X	Descrição do problema...	\N	\N	2025-11-17 17:25:08.907395	2025-11-17 17:25:08.907395	16	9	1	2	\N
21	aaa na página X	Descrição do problema...	\N	\N	2025-11-17 17:29:02.196928	2025-11-17 17:29:02.196928	16	13	1	2	\N
22	aaa na página X	Descrição do problema...	\N	\N	2025-11-17 18:54:02.687906	2025-11-17 18:54:02.687906	16	20	1	2	\N
23	felipeteste na página X	Descrição do problema...	\N	\N	2025-11-17 18:54:14.805498	2025-11-17 18:54:14.805498	16	21	1	2	\N
24	felipeteste na página X	Descrição do problema...	\N	\N	2025-11-17 18:54:28.476994	2025-11-17 18:54:28.476994	16	9	1	2	\N
25	Teste	Desc	\N	\N	2025-11-17 18:56:25.962132	2025-11-17 18:56:25.962132	16	1	1	2	\N
26	Teste	Desc	\N	\N	2025-11-17 18:58:47.574724	2025-11-17 18:58:47.574724	16	1	1	2	\N
27	Teste	Desc	\N	\N	2025-11-17 18:59:15.836049	2025-11-17 18:59:15.836049	16	1	1	2	\N
\.


--
-- TOC entry 3497 (class 0 OID 16895)
-- Dependencies: 220
-- Data for Name: setores; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.setores (id, nome) FROM stdin;
1	TI
3	RH
4	Operações
2	Financeiroee
5	teste novo setor
6	teste novo setor
7	vwqewevew
\.


--
-- TOC entry 3499 (class 0 OID 16901)
-- Dependencies: 222
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.status (id, chave, nome, ordem, "workflowId") FROM stdin;
19	teste_novo_2	teste novo 2	13	\N
5	documentacao	documentacao	5	\N
6	entregue	entregue	6	\N
1	em_atribuicao	em_atribuicao	1	\N
4	aprovacao	aprovacao	4	\N
7	em_execucao	Em execução	7	\N
8	teste_teste	testee	8	\N
10	teste_euvbuebe	teste euvbuebe	10	\N
11	teste33	testeevwvew vevewvew	11	\N
13	teste_teste_teste	teste teste teste	12	\N
14	teste_novo	teste novo	13	\N
2	em_fila	em_fila	2	\N
3	desenvolvimento	desenvolvimento	3	\N
\.


--
-- TOC entry 3501 (class 0 OID 16907)
-- Dependencies: 224
-- Data for Name: subtarefas; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.subtarefas (id, titulo, descricao, status, "createdAt", "ocorrenciaId", "responsavelId") FROM stdin;
33	vew	vwe	em_atribuicao	2025-11-12 02:32:41.765874	16	23
35	vew	wv	em_atribuicao	2025-11-12 02:38:26.691697	34	15
17	veewv	vweevw	em_atribuicao	2025-11-05 21:44:59.485141	41	10
30	vwe	ev	em_atribuicao	2025-11-12 02:28:59.054317	18	26
31	vwe	vwe	em_atribuicao	2025-11-12 02:29:02.275189	18	\N
\.


--
-- TOC entry 3503 (class 0 OID 16915)
-- Dependencies: 226
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.users (id, nome, email, "senhaHash", perfil, "setorId", peso) FROM stdin;
1	Admin	admin@local.com	$2b$10$VhWn9rRXAUQ7syKQdVgJk.MFcRVABK96ZXWRpbzXTdlCSB/dE/H1.	ADMIN	1	1
9	Nome do Usuário	usuario@exemplo.com	$2b$10$4cxm6N9M.12eDHqHanOwTO5/4W/g/AtUTf2m5JXj1r4hyPMY4cuya	COLABORADOR	1	1
10	Nome do Usuário	Leo@exemplo.com	$2b$10$Ba2yZX1pznmjoew4vWKBmOWnM4QNrRNh0n4BVuJPA0Pi/HV0OYi9G	ADMIN	1	1
12	leonardomagalhaes	leonardomagalhaes@slack	$2b$10$z009Fk13IyZUrgqNRpMKPurEoTMwUxg/xIeDqlmNOshOZmXJB5tMO	COLABORADOR	\N	1
13	João Silva	joao.silva@email.com	$2b$10$6rdbpuknIsuz/4NOmIy4ie8Td6OYAtUN9Q/.ZImkqTUPDfd8oICBq	COLABORADOR	1	1
14	Gabriel	gabrielalves.-100@hotmail.com	$2b$10$h6q7iaKgkxFgEZODbdjkduuZ7N6KFqdV6rUGfuKHx7M8CTXdR7H/q	COLABORADOR	2	1
15	teste2	developers@reconectaoficial.com.br	$2b$10$uhMjNe6AnWTsoeJDqicArerVAFsnMd7TQL83BqOVX9x.1fB7NtrXm	ADMIN	4	1
16	teste3	develrs@reconectaoficial.com.br	$2b$10$HX1v4RjDtqQ9lAALFuECYOa5WNaj6fp3b0OtfUPFn8HHwNWscgzI.	GESTOR	1	1
17	teste4	teste4@gmail.com	$2b$10$64J.HG3PyHoaE1InJLodG.q7eoi4A3SLRG9o2WSc1LB2wQLQxSXju	GESTOR	2	1
18	joaosilva	joaosilva@slack	$2b$10$1qNJJRw4.5eZNnT6cGkSJuPDiXJ6aNQ3v9i2w4UuzJOo.m8NB0hRS	COLABORADOR	\N	1
19	teste8	devepulers@gmail.com.br	$2b$10$4XFLMsPnm9oJTFO/cyKEsuZFSeH.4DHucoj1MlSRQfqw6nZpsk4BG	COLABORADOR	2	1
20	Andreza	a@exemplo.com	$2b$10$prXVMxC8qkf0ASABfqcPYeSoamD58kJiR0OUkEcvy/un3gfW.7uBS	COLABORADOR	1	1
21	a do Usuário	aa@exemplo.com	$2b$10$upxbx9IsTpCwtASxP1Ib8OoXcYrQ3jHWtzd0P09v.e4NVCnbnqKhO	COLABORADOR	1	1
22	felipe	felipe@gmail.com	$2b$10$laddVe6LbMMFrVZ6QdxiyuDvWkuzXIbDgTDJ.pVIZhaOWw4RvdZxG	ADMIN	1	1
23	andreza	andreza@slack	$2b$10$RfkKmtbRA8eRoq4xtw2tXu65tcwuN3wgIA0BBFQked.W2eOs0EsxW	COLABORADOR	\N	1
24	Andreza	andreza@example.com	$2b$10$IpQs3vPCwc.2eWQ4w8A1f.tniYXadAfKFtNne/MK46suJD4hGUpI.	GESTOR	1	1
25	Jardel Kahne	jardelkahne@reconectaoficial.com.br	$2b$10$OByYxf1.CR.UVDD2q5Fvm.XyNDoVhj2WjUT0m11.wJyXmBClTAwOq	GESTOR	1	1
26	Felipe ern	felipe@reconectaoficial.com.br	$2b$10$MrKloLdMQ9Jn72bTdyx6bevAcgyxnkjs8yF/ZIDZ469qjVOQTwc9C	ADMIN	1	1
27	Gabriel Reconecta	tyhtes@hotmail.com	$2b$10$7FzVST.YpVbQi6jnyMXdPu5khdiNePnHmPYWeOZS5vmU5rjzAmJxm	COLABORADOR	2	0.7
6	bbb Usuário	bbbb@local.com	$2b$10$LVNbxonXBtIafMtgPKsuhuamkWoc0Dh641GPKDrspMYmcumGMwM4y	GESTOR	1	0.6
28	teste gabriel	email@gmail.com	$2b$10$nL1B9mslNqIQWQxT6SHC9uA/fd4inZ0K2q3U4dOFrItYhOk4NrV.C	GESTOR	1	1
29	Felipe Ern	felipeern@gmail.com	$2b$10$jtQbnSvKONcKN3zsXbfLSeZcQSuedE7ZPrsDKYGJuRjwDUez5MfqK	ADMIN	1	1
\.


--
-- TOC entry 3505 (class 0 OID 16922)
-- Dependencies: 228
-- Data for Name: workflows; Type: TABLE DATA; Schema: public; Owner: oc_user
--

COPY public.workflows (id, nome, descricao) FROM stdin;
3	wefwe	wefewf
7	Pendente	evw
8	teste	teste
\.


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 215
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 396, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 217
-- Name: historico_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.historico_status_id_seq', 206, true);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 219
-- Name: ocorrencias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.ocorrencias_id_seq', 27, true);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 221
-- Name: setores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.setores_id_seq', 7, true);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 223
-- Name: status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.status_id_seq', 19, true);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 225
-- Name: subtarefas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.subtarefas_id_seq', 35, true);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.users_id_seq', 29, true);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 229
-- Name: workflows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: oc_user
--

SELECT pg_catalog.setval('public.workflows_id_seq', 8, true);


--
-- TOC entry 3322 (class 2606 OID 16937)
-- Name: historico_status PK_1791a2349274227665a8eb90361; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.historico_status
    ADD CONSTRAINT "PK_1791a2349274227665a8eb90361" PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 16939)
-- Name: workflows PK_5b5757cc1cd86268019fef52e0c; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT "PK_5b5757cc1cd86268019fef52e0c" PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 16941)
-- Name: setores PK_85908551895de8d968532c35d07; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.setores
    ADD CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 16943)
-- Name: ocorrencias PK_a04319dc4023e6a220648bf6006; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT "PK_a04319dc4023e6a220648bf6006" PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16945)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2606 OID 16947)
-- Name: subtarefas PK_bc5bc61f0ccc709af0de4ae6821; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.subtarefas
    ADD CONSTRAINT "PK_bc5bc61f0ccc709af0de4ae6821" PRIMARY KEY (id);


--
-- TOC entry 3328 (class 2606 OID 16949)
-- Name: status PK_e12743a7086ec826733f54e1d95; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY (id);


--
-- TOC entry 3336 (class 2606 OID 16951)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 3330 (class 2606 OID 16953)
-- Name: status UQ_e3eae10bf41b5d81ba4c18ae33a; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT "UQ_e3eae10bf41b5d81ba4c18ae33a" UNIQUE (chave);


--
-- TOC entry 3320 (class 2606 OID 16955)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 16956)
-- Name: ocorrencias FK_185254b7cb407f728bfdca27ecc; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT "FK_185254b7cb407f728bfdca27ecc" FOREIGN KEY ("statusId") REFERENCES public.status(id);


--
-- TOC entry 3342 (class 2606 OID 16961)
-- Name: ocorrencias FK_3904b91ae0ea97739c35fe4b265; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT "FK_3904b91ae0ea97739c35fe4b265" FOREIGN KEY ("gestorId") REFERENCES public.users(id);


--
-- TOC entry 3339 (class 2606 OID 16966)
-- Name: historico_status FK_72180905aa35d01385a3d1cb1da; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.historico_status
    ADD CONSTRAINT "FK_72180905aa35d01385a3d1cb1da" FOREIGN KEY ("statusId") REFERENCES public.status(id);


--
-- TOC entry 3343 (class 2606 OID 17007)
-- Name: ocorrencias FK_85d80b8aca6538efb82df356036; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT "FK_85d80b8aca6538efb82df356036" FOREIGN KEY ("workflowId") REFERENCES public.workflows(id);


--
-- TOC entry 3346 (class 2606 OID 16976)
-- Name: subtarefas FK_8c81d26ee8adc303b84a5507ceb; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.subtarefas
    ADD CONSTRAINT "FK_8c81d26ee8adc303b84a5507ceb" FOREIGN KEY ("responsavelId") REFERENCES public.users(id);


--
-- TOC entry 3344 (class 2606 OID 16981)
-- Name: ocorrencias FK_8fef05f0e3f70a7a7169aede11f; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT "FK_8fef05f0e3f70a7a7169aede11f" FOREIGN KEY ("colaboradorId") REFERENCES public.users(id);


--
-- TOC entry 3347 (class 2606 OID 16986)
-- Name: subtarefas FK_acf5f2c704c983b1cce14eda658; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.subtarefas
    ADD CONSTRAINT "FK_acf5f2c704c983b1cce14eda658" FOREIGN KEY ("ocorrenciaId") REFERENCES public.ocorrencias(id) ON DELETE CASCADE;


--
-- TOC entry 3340 (class 2606 OID 16991)
-- Name: historico_status FK_e6c2e82cefeecbbebc3818d8956; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.historico_status
    ADD CONSTRAINT "FK_e6c2e82cefeecbbebc3818d8956" FOREIGN KEY ("ocorrenciaId") REFERENCES public.ocorrencias(id) ON DELETE CASCADE;


--
-- TOC entry 3345 (class 2606 OID 16996)
-- Name: ocorrencias FK_e72db01cbfff3a3b73eed1636be; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.ocorrencias
    ADD CONSTRAINT "FK_e72db01cbfff3a3b73eed1636be" FOREIGN KEY ("setorId") REFERENCES public.setores(id);


--
-- TOC entry 3348 (class 2606 OID 17001)
-- Name: users FK_f686a42fcc8e1c0783e5300a95d; Type: FK CONSTRAINT; Schema: public; Owner: oc_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_f686a42fcc8e1c0783e5300a95d" FOREIGN KEY ("setorId") REFERENCES public.setores(id);


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: oc_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-11-17 16:38:14 -03

--
-- PostgreSQL database dump complete
--

\unrestrict bx11sNbq96NjJVdbZz19d4ZmFVJoJg6JUmdQsAPWW2ah86h6cnAbqJodlzLyzim

