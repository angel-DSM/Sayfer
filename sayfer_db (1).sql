create database if not exists proyecto_sayfer;
use proyecto_sayfer;

create table unidad_medida (
    id_unidad int auto_increment primary key,
    nombre_unidad varchar(50) not null
);

create table tipo_alimento (
    id_tipo_alimento int auto_increment primary key,
    nombre_alimento varchar(100) not null,
    descripcion_alimento text
);

create table tipo_medicamento (
    id_tipo_medicamento int auto_increment primary key,
    nombre varchar(100) not null,
    descripcion text
);

create table tipo_muerte (
    id_tipo_muerte int auto_increment primary key,
    nombre varchar(100) not null,
    descripcion text
);

create table galpon (
    id_galpon int auto_increment primary key,
    nombre varchar(100) not null,
    capacidad int not null
);

create table usuario (
    id_usuario int auto_increment primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    fecha_registro date not null,
    rol varchar(50) not null
);

create table ciclo_produccion (
    id_ciclo int auto_increment primary key,
    nombre_ciclo varchar(100),
    fecha_inicio date not null,
    fecha_fin date
);


create table stok_alimento (
    id_tipo_alimento int primary key,
    cantidad decimal(10,2) default 0,
    foreign key (id_tipo_alimento) references tipo_alimento(id_tipo_alimento)
);

create table stock_medicamento (
    id_tipo_medicamento int primary key,
    cantidad_actual decimal(10,2) default 0,
    id_unidad int,
    foreign key (id_tipo_medicamento) references tipo_medicamento(id_tipo_medicamento),
    foreign key (id_unidad) references unidad_medida(id_unidad)
);

create table ing_alimento (
    id_ing_alimento int auto_increment primary key,
    id_tipo_alimento int,
    cantidad decimal(10,2) not null,
    fecha_ingreso date not null,
    valor_unitario decimal(10,2),
    valor_total decimal(10,2),
    foreign key (id_tipo_alimento) references tipo_alimento(id_tipo_alimento)
);

create table ing_medicamento (
    id_ing_medicamento int auto_increment primary key,
    id_tipo_medicamento int,
    cantidad decimal(10,2) not null,
    id_unidad int,
    fecha_ingreso date not null,
    valor_unitario decimal(10,2),
    valor_total decimal(10,2),
    foreign key (id_tipo_medicamento) references tipo_medicamento(id_tipo_medicamento),
    foreign key (id_unidad) references unidad_medida(id_unidad)
);

create table galpon_ciclo_produccion (
    id_galpon int,
    id_ciclo int,
    fecha_inicio date not null,
    fecha_fin date,
    primary key (id_galpon, id_ciclo),
    foreign key (id_galpon) references galpon(id_galpon),
    foreign key (id_ciclo) references ciclo_produccion(id_ciclo)
);

create table admi_alimento (
    id_admi_alimento int auto_increment primary key,
    id_tipo_alimento int,
    id_galpon int,
    id_ciclo int,
    id_usuario int,
    cantidad_utilizada decimal(10,2) not null,
    fecha_alimentacion date not null,
    foreign key (id_tipo_alimento) references tipo_alimento(id_tipo_alimento),
    foreign key (id_galpon) references galpon(id_galpon),
    foreign key (id_ciclo) references ciclo_produccion(id_ciclo),
    foreign key (id_usuario) references usuario(id_usuario)
);

create table admi_medicamento (
    id_admi_medicamento int auto_increment primary key,
    id_tipo_medicamento int,
    id_usuario int,
    id_unidad int,
    id_ciclo int,
    id_galpon int,
    cantidad_utilizada decimal(10,2) not null,
    fecha_medicacion date not null,
    foreign key (id_tipo_medicamento) references tipo_medicamento(id_tipo_medicamento),
    foreign key (id_usuario) references usuario(id_usuario),
    foreign key (id_unidad) references unidad_medida(id_unidad),
    foreign key (id_ciclo) references ciclo_produccion(id_ciclo),
    foreign key (id_galpon) references galpon(id_galpon)
);

create table mortalidad (
    id_mortalidad int auto_increment primary key,
    id_ciclo int,
    id_galpon int,
    id_tipo_muerte int,
    fecha_muerte date not null,
    cantidad_muertos int not null,
    causa varchar(255),
    foreign key (id_ciclo) references ciclo_produccion(id_ciclo),
    foreign key (id_galpon) references galpon(id_galpon),
    foreign key (id_tipo_muerte) references tipo_muerte(id_tipo_muerte)
);