import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Text, Image } from "react-native";
import { Table, Row } from "react-native-table-component";

type Anuncio = {
  numero: number;
  imagen: string;
  descripcion: string;
};

export default function Home() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const res = await fetch("http://localhost:3001/anuncios"); // ⚠️ cambia por tu IP o localhost
        const data: Anuncio[] = await res.json();
        setAnuncios(data);
      } catch (err) {
        console.error("Error al obtener anuncios:", err);
      }
    };

    fetchAnuncios();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Contenedor central */}
      <View style={styles.content}>
        {/* 🔹 Título arriba de la tabla */}
        <Text style={styles.title}>📋 Lista de Anuncios</Text>

        {/* 🔹 Tabla */}
        <ScrollView horizontal>
          <View style={styles.tableWrapper}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#ccc" }}>
              {/* Cabecera */}
              <Row
                data={["Número", "Imagen", "Descripción"]}
                style={styles.head}
                textStyle={styles.headText}
              />

              {/* Filas dinámicas */}
              {anuncios.map((item) => (
                <Row
                  key={item.numero}
                  data={[
                    item.numero,
                    <Image
                      key={item.numero}
                      source={{ uri: item.imagen }}
                      style={styles.image}
                    />,
                    item.descripcion,
                  ]}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center", // centra verticalmente todo el contenido
    alignItems: "center", // centra horizontalmente todo
  },
  content: {
    alignItems: "center", // centra tabla + título
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  tableWrapper: {
    width: "90%",
    alignSelf: "center",
  },
  head: {
    height: 50,
    backgroundColor: "#e8e8e8",
  },
  headText: {
    margin: 6,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },
  text: {
    margin: 6,
    textAlign: "center",
    color: "#444",
  },
  image: {
    width: 80,
    height: 60,
    resizeMode: "cover",
    borderRadius: 5,
    alignSelf: "center",
  },
});
