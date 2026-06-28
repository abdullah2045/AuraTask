import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@auratask_level2_fix";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. READ: Ambil data saat aplikasi pertama kali dibuka
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) setTasks(JSON.parse(stored));
    } catch (e) {
      setTasks([]);
    }
  };

  const saveToStorage = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log("Gagal simpan ke storage");
    }
  };

  // --- HELPER ANTI-EROR (Jembatan Web Browser & HP Fisik) ---
  const triggerAlert = (title, message, onConfirm) => {
    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    } else {
      Alert.alert(title, message, [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Lanjutkan", style: "destructive", onPress: onConfirm },
      ]);
    }
  };

  // 2. CREATE: Tambah Tugas (Level 2)
  const handleAddTask = () => {
    if (!inputText.trim()) {
      if (Platform.OS === "web") alert("Nama tugas tidak boleh kosong!");
      else Alert.alert("Peringatan", "Nama tugas tidak boleh kosong!");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: inputText,
      completed: false,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveToStorage(updated);
    setInputText("");
  };

  // 3. UPDATE: Ubah Status Selesai / Belum (Level 2)
  const handleToggleTask = (id) => {
    const updated = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );
    setTasks(updated);
    saveToStorage(updated);
  };

  // 4. DELETE: Hapus 1 Item (Level 2 - DIPERBAIKI)
  const handleDeleteTask = (id, title) => {
    triggerAlert(
      "Hapus Tugas",
      `Yakin ingin menghapus tugas "${title}"?`,
      () => {
        const filtered = tasks.filter((item) => item.id !== id);
        setTasks(filtered);
        saveToStorage(filtered);
      },
    );
  };

  // 5. DELETE ALL: Reset Semua Data (Level 2 - DIPERBAIKI)
  const handleClearAll = () => {
    if (tasks.length === 0) return;
    triggerAlert(
      "Reset Semua Data",
      "Seluruh daftar tugasmu akan dihapus permanen. Lanjutkan?",
      async () => {
        setTasks([]);
        await AsyncStorage.removeItem(STORAGE_KEY);
      },
    );
  };

  // Logika Pencarian & Statistik (Level 2)
  const completedCount = tasks.filter((t) => t.completed).length;
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F5" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AuraTask ✨</Text>
          <Text style={styles.subtitle}>To-Do-List</Text>
        </View>
        <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Reset Semua</Text>
        </TouchableOpacity>
      </View>

      {/* STATS BANNER */}
      <View style={styles.statsCard}>
        <View>
          <Text style={styles.statsLabel}>Statistik Tugas</Text>
          <Text style={styles.statsNumber}>
            {completedCount}{" "}
            <Text style={styles.statsTotal}>/ {tasks.length} Selesai</Text>
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AsyncStorage</Text>
        </View>
      </View>

      {/* INPUT SEARCH & ADD */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari tugas..."
          placeholderTextColor="#8C9A92"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Ketik tugas baru..."
            placeholderTextColor="#8C9A92"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DAFTAR TUGAS */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Daftar Tugas Kosong 🍃</Text>
            <Text style={styles.emptyDesc}>
              Tambahkan tugas baru di atas. Data akan tersimpan otomatis di
              memori HP.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          /* DIPERBAIKI: Menggunakan View biasa sebagai pembungkus, bukan Touchable */
          <View
            style={[styles.taskCard, item.completed && styles.taskCardDone]}
          >
            {/* ZONA KIRI: Klik untuk Ubah Status (Update) */}
            <TouchableOpacity
              style={styles.taskInfo}
              onPress={() => handleToggleTask(item.id)}
              activeOpacity={0.6}
            >
              <View
                style={[styles.checkbox, item.completed && styles.checkboxDone]}
              >
                {item.completed && <Text style={styles.checkSymbol}>✓</Text>}
              </View>
              <View style={styles.textGroup}>
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.taskTextDone,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.timestamp}>Dibuat: {item.date}</Text>
              </View>
            </TouchableOpacity>

            {/* ZONA KANAN: Klik khusus untuk Hapus (Delete) */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteTask(item.id, item.title)}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#2D3A34" },
  subtitle: { fontSize: 12, color: "#6B7D73", fontWeight: "500", marginTop: 2 },
  clearBtn: {
    backgroundColor: "#FADBD8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearBtnText: { fontSize: 12, color: "#C0392B", fontWeight: "700" },

  statsCard: {
    marginHorizontal: 22,
    backgroundColor: "#4A7C59",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  statsLabel: {
    color: "#C8E0D0",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statsNumber: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  statsTotal: { fontSize: 13, fontWeight: "500", color: "#E9F2EC" },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },

  inputSection: { paddingHorizontal: 22, marginTop: 15 },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 13,
    color: "#2D3A34",
    borderWidth: 1,
    borderColor: "#E2E8E4",
    marginBottom: 8,
  },
  addRow: { flexDirection: "row", gap: 8 },
  addInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#2D3A34",
    borderWidth: 1,
    borderColor: "#E2E8E4",
  },
  addBtn: {
    backgroundColor: "#2D3A34",
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#FFFFFF", fontSize: 24, fontWeight: "600" },

  listContainer: { paddingHorizontal: 22, paddingTop: 15, paddingBottom: 40 },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDF1EF",
  },
  taskCardDone: { backgroundColor: "#F9FBF9", opacity: 0.7 },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4A7C59",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxDone: { backgroundColor: "#4A7C59" },
  checkSymbol: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  textGroup: { flex: 1 },
  taskText: { fontSize: 14, fontWeight: "600", color: "#2D3A34" },
  taskTextDone: { textDecorationLine: "line-through", color: "#8C9A92" },
  timestamp: { fontSize: 10, color: "#A5B3AC", marginTop: 2 },
  deleteBtn: { padding: 8, backgroundColor: "#F4F7F5", borderRadius: 8 },
  deleteText: { color: "#E74C3C", fontSize: 14, fontWeight: "800" },

  emptyState: { alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A7C59",
    marginBottom: 4,
  },
  emptyDesc: { fontSize: 12, color: "#8C9A92", textAlign: "center" },
});
