import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function Edit() {
  const [id, setId] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const router = useRouter();

  const BASE_URL =
    Platform.OS === "web"
      ? "http://localhost:3001"
      : "https://braggadocian-tomiko-extollingly.ngrok-free.dev";

  // 🗑️ Eliminar
  const handleDelete = async () => {
    if (!id) return Alert.alert("Error", "Ingresa el número del anuncio a eliminar");
    try {
      const res = await fetch(`${BASE_URL}/anuncios/${id}`, { method: "DELETE" });
      const data = await res.json();
      Alert.alert("Resultado", data.message || "Acción completada");
    } catch (err) {
      console.error("Error al eliminar:", err);
      Alert.alert("Error", "No se pudo eliminar el registro");
    }
  };

  // ✏️ Editar
  const handleEdit = async () => {
    if (!id) return Alert.alert("Error", "Ingresa el número del anuncio a editar");
    try {
      const res = await fetch(`${BASE_URL}/anuncios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagen, descripcion }),
      });
      const data = await res.json();
      Alert.alert("Resultado", data.message || "Registro actualizado");
    } catch (err) {
      console.error("Error al editar:", err);
      Alert.alert("Error", "No se pudo actualizar el registro");
    }
  };

  // ➕ Agregar
  const handleAdd = async () => {
    if (!id || !descripcion)
      return Alert.alert("Error", "Debes ingresar al menos número y descripción");

    try {
      const res = await fetch(`${BASE_URL}/anuncios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: id,
          imagen: imagen || null,
          descripcion,
        }),
      });
      const data = await res.json();
      Alert.alert("Resultado", data.message || "Registro agregado");
    } catch (err) {
      console.error("Error al agregar:", err);
      Alert.alert("Error", "No se pudo agregar el registro");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ CRUD de Anuncios</Text>

      <TextInput
        style={styles.input}
        placeholder="Número (ID del anuncio)"
        keyboardType="numeric"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="URL de imagen (opcional)"
        value={imagen}
        onChangeText={setImagen}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: "#28a745" }]} onPress={handleAdd}>
        <Text style={styles.buttonText}>➕ Agregar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#007bff" }]} onPress={handleEdit}>
        <Text style={styles.buttonText}>✏️ Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#dc3545" }]} onPress={handleDelete}>
        <Text style={styles.buttonText}>🗑️ Eliminar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#6c757d" }]} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>⬅️ Regresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});