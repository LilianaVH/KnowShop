import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Table, Row } from "react-native-table-component";
import { useRouter } from "expo-router";

type Anuncio = {
  numero: number;
  imagen: string;
  descripcion: string;
};

export default function Home() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const router = useRouter();

  // 🌐 Cambia automáticamente según la plataforma
  const BASE_URL =
    Platform.OS === "web"
      ? "http://localhost:3001"
      : "https://braggadocian-tomiko-extollingly.ngrok-free.dev";

  // 🔹 Obtener anuncios desde MySQL
  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const res = await fetch(`${BASE_URL}/anuncios`);
        const data: Anuncio[] = await res.json();
        setAnuncios(data);
      } catch (err) {
        console.error("🚨 Error al obtener anuncios:", err);
      }
    };

    fetchAnuncios();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Contenedor central */}
      <View style={styles.content}>
        {/* 🔹 Título */}
        <Text style={styles.title}>📋 Lista de Anuncios</Text>

        {/* 🔹 Tabla de anuncios */}
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

      {/* 🔹 Botón flotante CRUD */}
      <TouchableOpacity
        style={styles.crudButton}
        onPress={() => router.push("/edit")}
      >
        <Text style={styles.crudButtonText}>CRUD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginTop: 40,
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
  crudButton: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  crudButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});